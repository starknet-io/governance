import { router, publicProcedure } from '../utils/trpc';
import { posts } from '../db/schema/posts';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

const postInsertSchema = createInsertSchema(posts);

// list(page, perPage, sortBy, filters)

export const postsRouter = router({
  getAll: publicProcedure.query(() => db.select().from(posts)),

  savePost: publicProcedure
    .input(postInsertSchema.omit({ id: true }))
    .mutation(async (opts) => {
      const insertedPost = await db
        .insert(posts)
        .values(opts.input)
        .returning();

      return insertedPost[0];
    }),

  editPost: publicProcedure
    .input(postInsertSchema.required({ id: true }))
    .mutation(async (opts) => {
      const updatedPost = await db
        .update(posts)
        .set(opts.input)
        .where(eq(posts.id, opts.input.id))
        .returning();
      return updatedPost[0];
    }),

  deletePost: publicProcedure
    .input(postInsertSchema.required({ id: true }).pick({ id: true }))
    .mutation(async (opts) => {
      await db.delete(posts).where(eq(posts.id, opts.input.id)).execute();
    }),
});
