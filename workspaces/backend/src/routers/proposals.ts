import { router, publicProcedure, protectedProcedure } from '../utils/trpc';
import { proposals } from '../db/schema/proposals';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { getUserByJWT } from "../utils/helpers";

const proposalInsertSchema = createInsertSchema(proposals);

// list(page, perPage, sortBy, filters)
// create voting proposal
// create snip proposal

export const proposalsRouter = router({
  getAll: publicProcedure.query(async () => {
    const data = await db.query.proposals.findMany({
      with: {
        author: true
      }
    })

    return data
  }),

  getSNIP: publicProcedure
    .input(proposalInsertSchema.required({ id: true }).pick({ id: true }))
    .query(async (opts) => {
      const data = await db.query.proposals.findFirst({
        where: eq(proposals.id, opts.input.id),
        with: {
          author: true
        }
      })

      return data;
    }),

  createSNIP: protectedProcedure
    .input(proposalInsertSchema.omit({ id: true, type: true, status: true }))
    .mutation(async (opts) => {
      const insertedProposal = await db
        .insert(proposals)
        .values({
          ...opts.input,
          type: 'snip',
          status: 'Draft',
          userId: (await getUserByJWT(opts.ctx.req.cookies.JWT))?.id,
        })
        .returning();

      return insertedProposal[0];
    }),

  editProposal: publicProcedure
    .input(proposalInsertSchema.required({ id: true }))
    .mutation(async (opts) => {
      const updatedProposal = await db
        .update(proposals)
        .set(opts.input)
        .where(eq(proposals.id, opts.input.id))
        .returning();

      return updatedProposal[0];
    }),

  deleteProposal: publicProcedure
    .input(proposalInsertSchema.required({ id: true }).pick({ id: true }))
    .mutation(async (opts) => {
      await db
        .delete(proposals)
        .where(eq(proposals.id, opts.input.id))
        .execute();
    }),
});
