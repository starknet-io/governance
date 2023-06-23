import { router, publicProcedure, protectedProcedure } from '../utils/trpc';
import { comments } from '../db/schema/comments';
import { db } from '../db/db';
import { eq, desc } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { getUserByJWT } from "../utils/helpers";
import { z } from "zod";

const commentInsertSchema = createInsertSchema(comments);

// list(page, perPage, sortBy, filters)
// commentOnPost(postId, body)
// commentOnProposal(proposalId, body)

export const commentsRouter = router({
  getAll: publicProcedure.query(() => db.select().from(comments)),

  getProposalComments: publicProcedure.
    input(z.object({ proposalId: z.string() }))
    .query(async (opts) => {
      const data = await db.query.comments.findMany({
        where: eq(comments.proposalId, opts.input.proposalId),
        orderBy: [desc(comments.createdAt)],
        with: {
          author: true,
        },
      })
      return data;
    }),


  saveComment: protectedProcedure
    .input(commentInsertSchema.omit({ id: true }))
    .mutation(async (opts) => {
      const insertedComment = await db
        .insert(comments)
        .values({
          ...opts.input,
          userId: (await getUserByJWT(opts.ctx.req.cookies.JWT))?.id
        })
        .returning();

      return insertedComment[0];
    }),

  editComment: publicProcedure
    .input(commentInsertSchema.required({ id: true }))
    .mutation(async (opts) => {
      const updatedComment = await db
        .update(comments)
        .set(opts.input)
        .where(eq(comments.id, opts.input.id))
        .returning();
      return updatedComment[0];
    }),

  deleteComment: publicProcedure
    .input(commentInsertSchema.required({ id: true }).pick({ id: true }))
    .mutation(async (opts) => {
      await db.delete(comments).where(eq(comments.id, opts.input.id)).execute();
    }),
});
