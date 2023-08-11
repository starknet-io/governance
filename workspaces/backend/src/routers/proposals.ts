import { desc, eq, sql } from 'drizzle-orm';
import { db } from '../db/db';
import { router, publicProcedure } from '../utils/trpc';
import { gql, GraphQLClient } from 'graphql-request';
import { comments } from '../db/schema/comments';
import { z } from 'zod';

//TODO: Fix types

const endpoint = `https://hub.snapshot.org/graphql`;
const space = 'robwalsh.eth';

const graphQLClient = new GraphQLClient(endpoint, {
  method: `GET`,
});

//GraphQL
const GET_PROPOSALS_BY_ID = gql`
  query proposals(
    $space: String!
    $searchQuery: String = ""
    $ids: [String!] = []
    $first: Int = 20
    $skip: Int = 0
  ) {
    proposals(
      first: $first
      skip: $skip
      where: { space: $space, title_contains: $searchQuery, id_in: $ids }
    ) {
      id
      title
      choices
      start
      end
      snapshot
      state
      scores
      scores_total
      author
      space {
        id
        name
      }
    }
  }
`;

const GET_PROPOSALS = gql`
  query proposals(
    $space: String!
    $orderDirection: OrderDirection!
    $searchQuery: String = ""
    $first: Int = 20
    $skip: Int = 0
  ) {
    proposals(
      first: $first
      skip: $skip
      orderBy: "created"
      orderDirection: $orderDirection
      where: { space: $space, title_contains: $searchQuery }
    ) {
      id
      title
      choices
      start
      end
      snapshot
      state
      scores
      scores_total
      author
      space {
        id
        name
      }
    }
  }
`;

const sortProposalsByIDsOrder = (proposals: any[], ids: string[]) => {
  const itemMap = new Map();
  proposals.forEach((item) => itemMap.set(item.id, item));
  return ids.map((id) => itemMap.get(id)).filter((i) => !!i);
};

const populateProposalsWithComments = async (
  proposals: any[],
  limit: number,
  offset: number,
) => {
  return await Promise.all(
    proposals.map(async (i: any) => {
      const commentList = await db.query.comments.findMany({
        where: eq(comments.proposalId, i.id),
        orderBy: [desc(comments.createdAt)],
        with: {
          author: true,
        },
        limit,
        offset,
      });
      return {
        ...i,
        comments: commentList,
      };
    }),
  );
};

export const proposalsRouter = router({
  getProposals: publicProcedure
    .input(
      z
        .object({
          sortBy: z.enum(['desc', 'asc', 'most_discussed', '']).optional(),
          searchQuery: z.string().optional(),
        })
        .optional(),
    )
    .query(async (opts) => {
      const limit = 20;
      const offset = 0;

      const orderDirection = opts.input?.sortBy || 'desc';
      const searchQuery = opts.input?.searchQuery || undefined;

      let proposals;

      if (opts.input?.sortBy === 'most_discussed') {
        const mostDiscussedItems = await db.execute(sql`
          SELECT
            proposal_id,
            COUNT(*) AS comment_count
          FROM
            comments
          GROUP BY
            proposal_id
          ORDER BY
            comment_count DESC
          LIMIT ${limit} OFFSET ${offset};
        `);

        const mostDiscussedProposals = mostDiscussedItems.rows
          .filter((item) => item.proposal_id !== null)
          .map((item) => item.proposal_id) as string[];

        const { proposals: queriedProposals } = (await graphQLClient.request(
          GET_PROPOSALS_BY_ID,
          {
            searchQuery,
            ids: mostDiscussedProposals,
            first: limit,
            skip: offset,
            space,
          },
        )) as any;

        proposals = sortProposalsByIDsOrder(
          queriedProposals,
          mostDiscussedProposals,
        );
      } else {
        const { proposals: queriedProposals } = (await graphQLClient.request(
          GET_PROPOSALS,
          {
            orderDirection,
            searchQuery,
            first: limit,
            skip: offset,
            space,
          },
        )) as any;

        proposals = queriedProposals;
      }

      return await populateProposalsWithComments(proposals, limit, offset);
    }),
});
