import { router, publicProcedure } from '../utils/trpc';
import { comments } from '../db/schema/comments';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

const commentInsertSchema = createInsertSchema(comments);

// list(page, perPage, sortBy, filters)
// commentOnPost(postId, body)
// commentOnProposal(proposalId, body)

export const commentsRouter = router({
  getAll: publicProcedure.query(() => db.select().from(comments)),

  saveComment: publicProcedure
    .input(commentInsertSchema.omit({ id: true }))
    .mutation(async (opts) => {
      const insertedComment = await db
        .insert(comments)
        .values(opts.input)
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
