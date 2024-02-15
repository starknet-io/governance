import { router, publicProcedure } from '../utils/trpc';
import { votes } from '../db/schema/votes';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { oldVotes } from '../db/schema/oldVotes';

// list(page, perPage, sortBy, filters)
// cast a vote

export const votesRouter = router({
  getAll: publicProcedure.query(() => db.select().from(votes)),

  getOldVotesForProposal: publicProcedure
    .input(
      z.object({
        proposalId: z.string(),
      }),
    )
    .query(async (opts) => {
      const { proposalId } = opts.input;
      const votes = await db.query.oldVotes.findMany({
        orderBy: (oldVotes, { desc }) => [desc(oldVotes.createdAt)],
        where: eq(oldVotes.proposalId, proposalId),
        with: {
          author: {
            with: {
              author: {
                address: true,
                ethAddress: true,
                starknetAddress: true,
              },
            },
          },
        },
        limit: 100,
      });

      if (!votes) {
        return [];
      }

      const parsedVotes = votes.map((vote: any) => ({
        ...vote,
        voter: vote?.author?.author?.address || '',
      }));

      return parsedVotes;
    }),
});
