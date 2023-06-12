import { router, publicProcedure } from '../utils/trpc';
import { councils } from '../db/schema/councils';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

const councilInsertSchema = createInsertSchema(councils);

// list() return all councils
// getCouncilById(id) optionally with latest votes and posts
// getCouncilBySlug(slug) optionally with latest votes and posts
// updateCouncil

export const councilsRouter = router({
  getAll: publicProcedure.query(() => db.select().from(councils)),

  saveCouncil: publicProcedure
    .input(councilInsertSchema.omit({ id: true }))
    .mutation(async (opts) => {
      const insertedCouncil = await db
        .insert(councils)
        .values(opts.input)
        .returning();

      return insertedCouncil[0];
    }),

  editCouncil: publicProcedure
    .input(councilInsertSchema.required({ id: true }))
    .mutation(async (opts) => {
      const updatedCouncil = await db
        .update(councils)
        .set(opts.input)
        .where(eq(councils.id, opts.input.id))
        .returning();
      return updatedCouncil[0];
    }),

  deleteCouncil: publicProcedure
    .input(councilInsertSchema.required({ id: true }).pick({ id: true }))
    .mutation(async (opts) => {
      await db.delete(councils).where(eq(councils.id, opts.input.id)).execute();
    }),
});
