import { router, publicProcedure, protectedProcedure } from '../utils/trpc';
import { votes } from '../db/schema/votes';
import { db } from '../db/db';
import {and, eq, not} from 'drizzle-orm';
import { z } from 'zod';
import { oldVotes } from '../db/schema/oldVotes';

export const votesRouter = router({
  getAll: publicProcedure.query(() => db.select().from(votes)),

  saveVote: protectedProcedure
    .input(
      z.object({
        proposalId: z.string(),
        voterAddress: z.string(),
        comment: z.string().optional(),
      }),
    )
    .mutation(async (opts) => {
      const { id: userId } = opts.ctx.user;
      const { proposalId, voterAddress, comment } = opts.input;

      // Only save if a comment is provided
      if (comment && comment.trim().length > 0) {
        await db.insert(votes).values({
          proposalId,
          userId: userId,
          comment,
          voterAddress,
        });
      }

      return { success: true };
    }),

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

  getNonEmptyCommentsForProposal: publicProcedure
    .input(
      z.object({
        proposalId: z.string(),
        limit: z.number().optional(),
      }),
    )
    .query(async (opts) => {
      const { proposalId, limit } = opts.input;

      // Fetch comments that are not null or empty and match the proposalId
      const comments = await db.query.votes.findMany({
        where: and(
          eq(votes.proposalId, proposalId),
          not(eq(votes.comment, ''))
        ),
        orderBy: (votes, { desc }) => [desc(votes.createdAt)],
        limit: limit || 100,
      });

      if (!comments) {
        return [];
      }

      // Transform the results to the required format
      const formattedComments = comments.map((vote: any) => ({
        proposalId: vote.proposalId,
        voterAddress: vote.voterAddress,
        comment: vote.comment,
      }));

      return formattedComments;
    }),
});
