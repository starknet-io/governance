import { router, publicProcedure, protectedProcedure } from '../utils/trpc';
import { snips } from '../db/schema/snips';
import { db } from '../db/db';
import { desc, eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { getUserByJWT } from "../utils/helpers";
import { comments } from '../db/schema/comments';

const snipInsertSchema = createInsertSchema(snips);

// list(page, perPage, sortBy, filters)
// create voting proposal
// create snip proposal

export const snipsRouter = router({
  getAll: publicProcedure.query(async () => {
    const data = await db.query.snips.findMany({
      with: {
        author: true,
        comments: true,
      }
    })
    return data
  }),

  getSNIP: publicProcedure
    .input(snipInsertSchema.required({ id: true }).pick({ id: true }))
    .query(async (opts) => {
      const data = await db.query.snips.findFirst({
        where: eq(snips.id, opts.input.id),
        with: {
          author: true,
          comments: {
            with: {
              author: true
            },
            orderBy: [desc(comments.createdAt)]
          }
        },
      })
      return data;
    }),

  createSNIP: protectedProcedure
    .input(snipInsertSchema.omit({ id: true, type: true, status: true }))
    .mutation(async (opts) => {
      const insertedSnip = await db
        .insert(snips)
        .values({
          ...opts.input,
          type: 'snip',
          status: 'Draft',
          userId: (await getUserByJWT(opts.ctx.req.cookies.JWT))?.id,
        })
        .returning();


      return insertedSnip[0];
    }),

  editProposal: publicProcedure
    .input(snipInsertSchema.required({ id: true }))
    .mutation(async (opts) => {
      const updatedSnip = await db
        .update(snips)
        .set(opts.input)
        .where(eq(snips.id, opts.input.id))
        .returning();

      return updatedSnip[0];
    }),

  deleteProposal: publicProcedure
    .input(snipInsertSchema.required({ id: true }).pick({ id: true }))
    .mutation(async (opts) => {
      await db
        .delete(snips)
        .where(eq(snips.id, opts.input.id))
        .execute();
    }),
});
