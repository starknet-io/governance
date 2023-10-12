import { desc, eq, inArray, sql } from 'drizzle-orm';
import { db } from '../db/db';
import { router, publicProcedure, protectedProcedure } from '../utils/trpc';
import { gql, GraphQLClient } from 'graphql-request';
import { comments } from '../db/schema/comments';
import { z } from 'zod';
import { proposals } from '../db/schema/proposals';
import { createInsertSchema } from 'drizzle-zod';
import { Algolia } from '../utils/algolia';

type CategoryEnum = 'category1' | 'category2' | 'category3';

interface IProposal {
  id: string;
  title: string;
  choices: string[];
  start: number;
  category?: CategoryEnum;
  end: number;
  snapshot: string;
  state: string;
  scores: number[];
  scores_total: number;
  author: string;
  space: { id: string; name: string };
}

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

const sortProposalsByIDsOrder = (
  proposals: IProposal[],
  ids: string[],
): IProposal[] => {
  const itemMap = new Map();
  proposals.forEach((item) => itemMap.set(item.id, item));
  return ids.map((id) => itemMap.get(id)).filter((i) => !!i);
};

const populateProposalsWithComments = async (
  proposals: IProposal[],
  limit: number,
  offset: number,
) => {
  return await Promise.all(
    proposals.map(async (i: IProposal) => {
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
  createProposal: protectedProcedure
    .input(
      createInsertSchema(proposals)
        .extend({
          title: z.string().optional(),
          discussion: z.string().optional(),
        })
        .omit({ id: true }),
    ) // Adjust as needed
    .mutation(async (opts) => {
      const insertedProposal = await db
        .insert(proposals)
        .values({
          proposalId: opts.input.proposalId,
          category: opts.input.category,
        })
        .returning();

      const newItem = insertedProposal?.[0];
      await Algolia.saveObjectToIndex({
        name: opts.input.title ?? '',
        content: opts.input.discussion ?? '',
        type: 'voting_proposal',
        refID: opts.input.proposalId,
      });

      return newItem;
    }),

  getProposalById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const ourProposalData = await db.query.proposals.findFirst({
        where: eq(proposals.proposalId, opts.input.id),
      });
      const { proposals: queriedProposals } = (await graphQLClient.request(
        GET_PROPOSALS_BY_ID,
        {
          ids: [opts.input.id],
          space,
        },
      )) as { proposals: IProposal[] };
      const totalComments = await db.query.comments.findMany({
        where: eq(proposals.proposalId, opts.input.id),
      })
      const proposal = queriedProposals[0];

      return {
        status: proposal.state,
        comments: totalComments.length,
        category: ourProposalData?.category,
        startDate: proposal.start,
        backendProposalData: ourProposalData,
        proposal,
      };
    }),

  getProposals: publicProcedure
    .input(
      z
        .object({
          sortBy: z.enum(['desc', 'asc', 'most_discussed', '']).optional(),
          searchQuery: z.string().optional(),
          filters: z.array(z.string()).optional(),
        })
        .optional(),
    )
    .query(async (opts) => {
      const limit = 20;
      const offset = 0;

      const orderDirection = opts.input?.sortBy || 'desc';
      const searchQuery = opts.input?.searchQuery || undefined;
      const filters = opts.input?.filters;
      const possibleStateFilters = ['active', 'pending', 'closed'];

      const statesFilter =
        filters?.filter((filter) => possibleStateFilters.includes(filter)) ||
        [];
      const categoriesFilter =
        filters?.filter((filter) => !possibleStateFilters.includes(filter)) ||
        [];

      let mappedProposals: IProposal[];
      if (opts.input?.sortBy === 'most_discussed') {
        const mostDiscussedItems = await db.execute(sql`
          SELECT
            comments.proposal_id,
            proposals.category,  -- It will return NULL if the category is not found
            COUNT(*) AS comment_count
          FROM
            comments
          LEFT JOIN
            proposals ON comments.proposal_id = proposals.proposal_id  -- Changing to LEFT JOIN to include rows even if there is no matching row in the proposals table
          GROUP BY
            comments.proposal_id, proposals.category  -- Group by category as well, it will group by NULL as a separate group if there are null values
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
        )) as { proposals: IProposal[] };

        mappedProposals = sortProposalsByIDsOrder(
          queriedProposals,
          mostDiscussedProposals,
        );

        if (statesFilter.length > 0) {
          mappedProposals = mappedProposals.filter((proposal) =>
            statesFilter.includes(proposal.state),
          );
        }

        mappedProposals = mappedProposals.map((proposal, index) => {
          return {
            ...proposal,
            category: mostDiscussedItems.rows[index].category as CategoryEnum,
          };
        });

        if (categoriesFilter.length > 0) {
          mappedProposals = mappedProposals.filter((proposal) => {
            if (!proposal?.category) {
              return false;
            }
            return categoriesFilter.includes(proposal.category);
          });
        }
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
        )) as { proposals: IProposal[] };

        const proposalIds = queriedProposals.map((proposal) => proposal.id);
        const categoriesResult = await db
          .select()
          .from(proposals)
          .where(inArray(proposals.proposalId, proposalIds))
          .execute();

        const categoriesMap = Object.fromEntries(
          categoriesResult.map((row) => [row.proposalId, row.category]),
        );

        // Merge category data into the proposals array
        mappedProposals = queriedProposals.map((proposal) => ({
          ...proposal,
          category: categoriesMap[proposal.id] as CategoryEnum,
        }));
      }

      if (statesFilter.length > 0) {
        mappedProposals = mappedProposals.filter((proposal) =>
          statesFilter.includes(proposal.state),
        );
      }

      if (categoriesFilter.length > 0) {
        mappedProposals = mappedProposals.filter((proposal) => {
          if (!proposal.category) {
            return false;
          }
          return categoriesFilter.includes(proposal.category);
        });
      }

      return await populateProposalsWithComments(
        mappedProposals,
        limit,
        offset,
      );
    }),
});
