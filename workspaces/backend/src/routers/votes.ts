import { router, publicProcedure } from '../utils/trpc';
import { votes } from '../db/schema/votes';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

const voteInsertSchema = createInsertSchema(votes);

// list(page, perPage, sortBy, filters)
// cast a vote

export const votesRouter = router({
  getAll: publicProcedure.query(() => db.select().from(votes)),

  saveVote: publicProcedure
    .input(voteInsertSchema.omit({ id: true }))
    .mutation(async (opts) => {
      const insertedVote = await db
        .insert(votes)
        .values(opts.input)
        .returning();

      return insertedVote[0];
    }),

  editVote: publicProcedure
    .input(voteInsertSchema.required({ id: true }))
    .mutation(async (opts) => {
      const updatedVote = await db
        .update(votes)
        .set(opts.input)
        .where(eq(votes.id, opts.input.id))
        .returning();
      return updatedVote[0];
    }),

  deleteVote: publicProcedure
    .input(voteInsertSchema.required({ id: true }).pick({ id: true }))
    .mutation(async (opts) => {
      await db.delete(votes).where(eq(votes.id, opts.input.id)).execute();
    }),
});
