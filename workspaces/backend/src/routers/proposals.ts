import {router, publicProcedure, protectedProcedure} from '../utils/trpc';
import { proposals } from '../db/schema/proposals';
import { db } from '../db/db';
import {createInsertSchema} from "drizzle-zod";

export const proposalsRouter = router({
  createProposal: protectedProcedure
    .input(createInsertSchema(proposals).omit({ id: true })) // Adjust as needed
    .mutation(async (opts) => {
      const insertedProposal = await db
        .insert(proposals)
        .values(opts.input)
        .returning();
      return insertedProposal[0];
    }),
  getAllWithCategories: publicProcedure.query(async () => {
    const data = await db.select().from(proposals);
    return data;
  }),
});
