import { desc, eq, sql } from 'drizzle-orm';
import { db } from '../db/db';
import { router, publicProcedure, protectedProcedure } from '../utils/trpc';
import { GraphQLClient } from 'graphql-request';
import { comments } from '../db/schema/comments';
import { z } from 'zod';
import { proposals } from '../db/schema/proposals';
import { createInsertSchema } from 'drizzle-zod';
import { Algolia } from '../utils/algolia';
import { GET_PROPOSAL_QUERY, GET_PROPOSALS_QUERY } from '../queries/queries';
import { transformProposalData } from '../queries/helpers';

export interface IProposal {
  id: string;
  title: string;
  choices: string[];
  start: number;
  end: number;
  snapshot: string;
  state: string;
  scores: number[];
  scores_total: number;
  author: string;
  space: { id: string; name: string };
}

export interface IProposalWithComments extends IProposal {
  comments: {
    [x: string]: any;
  }[];
}

const endpoint = process.env.SNAPSHOT_X_ENDPOINT! as string;
const space = process.env.SNAPSHOT_X_SPACE;
export interface IProposalWithCommentsCount extends IProposal {
  commentsCount: number;
}

const endpoint = `https://hub.snapshot.org/graphql`;
const space = process.env.SNAPSHOT_SPACE;

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
    // Include any other headers your GraphQL server might require
  },
});

const populateProposalsWithCommentsCount = async (
  proposals: IProposal[],
): Promise<IProposalWithCommentsCount[]> => {
  return Promise.all(
    proposals.map(async (proposal: IProposal) => {
      const commentsCount = await db
        .select({
          value: sql`count(${comments.id})`.mapWith(Number),
        })
        .from(comments)
        .where(eq(comments.proposalId, proposal.id))
        .then((result) => result[0]?.value || 0);

      return {
        ...proposal,
        commentsCount,
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

  getProposalCommentCount: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const { id } = opts.input;
      const commentsCount = await db
        .select({
          value: sql`count(${comments.id})`.mapWith(Number),
        })
        .from(comments)
        .where(eq(comments.proposalId, id))
        .then((result) => result[0]?.value || 0);

      return commentsCount || 0
    }),

  getProposalById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const ourProposalData = await db.query.proposals.findFirst({
        where: eq(proposals.proposalId, opts.input.id),
      });
      const data = (await graphQLClient.request(GET_PROPOSAL_QUERY, {
        id: opts.input.id,
        space,
      })) as { proposal: IProposal };
      const totalComments = await db.query.comments.findMany({
        where: eq(proposals.proposalId, opts.input.id),
      });
      console.log(data);

      const foundProposal = data?.proposal || {};

      const transformedProposal = transformProposalData(foundProposal);

      return {
        status: transformedProposal.state,
        comments: totalComments.length,
        startDate: transformedProposal.start,
        backendProposalData: ourProposalData,
        transformedProposal,
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

      const orderDirection =
        opts.input?.sortBy && opts.input?.sortBy !== 'most_discussed'
          ? opts.input?.sortBy
          : 'desc';
      //const searchQuery = opts.input?.searchQuery || undefined;

      const filters = opts.input?.filters;
      const possibleStateFilters = ['active', 'pending', 'closed'];

      const statesFilter =
        filters?.filter((filter) => possibleStateFilters.includes(filter)) ||
        [];

      let mappedProposals: IProposal[];
      const data = (await graphQLClient.request(GET_PROPOSALS_QUERY, {
        space,
        orderDirection,
      })) as { proposals: IProposal[] };

      const queriedProposals = transformProposalData(data || []) || [];

      // Merge category data into the proposals array
      mappedProposals = queriedProposals.map((proposal: any) => ({
        ...proposal,
      }));

      if (statesFilter.length > 0) {
        mappedProposals = mappedProposals.filter((proposal) =>
          statesFilter.includes(proposal.state),
        );
      }

      let proposalsWithComments: IProposalWithCommentsCount[] =
        await populateProposalsWithCommentsCount(mappedProposals);

      if (opts?.input?.sortBy === 'most_discussed') {
        proposalsWithComments = proposalsWithComments.sort(
          (a, b) => (b?.commentsCount || 0) - (a?.commentsCount || 0),
        );
      }
      return proposalsWithComments;
    }),
});
