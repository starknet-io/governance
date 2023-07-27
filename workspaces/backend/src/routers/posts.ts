import { router, publicProcedure, protectedProcedure } from '../utils/trpc';
import { posts } from '../db/schema/posts';
import { db } from '../db/db';
import { desc, eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { getUserByJWT } from '../utils/helpers';
import { comments } from '../db/schema/comments';

const postInsertSchema = createInsertSchema(posts);

// list(page, perPage, sortBy, filters)

export const postsRouter = router({
  getAll: publicProcedure.query(() => db.select().from(posts)),

  savePost: protectedProcedure
    .input(postInsertSchema.omit({ id: true }))
    .mutation(async (opts) => {
      const insertedPost = await db
        .insert(posts)
        .values({
          ...opts.input,
          createdAt: new Date(),
          userId: (await getUserByJWT(opts.ctx.req.cookies.JWT))?.id
        })
        .returning();

      return insertedPost[0];
    }),

  editPost: protectedProcedure
    .input(postInsertSchema.required({ id: true }))
    .mutation(async (opts) => {
      const updatedPost = await db
        .update(posts)
        .set(opts.input)
        .where(eq(posts.id, opts.input.id))
        .returning();
      return updatedPost[0];
    }),

  deletePost: protectedProcedure
    .input(postInsertSchema.required({ id: true }).pick({ id: true }))
    .mutation(async (opts) => {
      await db.delete(posts).where(eq(posts.id, opts.input.id)).execute();
    }),

  getPostById: publicProcedure
    .input(postInsertSchema.required({ id: true }).pick({ id: true }))
    .query(async (opts) => {
      const post = await db.query.posts.findFirst({
        where: eq(posts.id, opts.input.id),
        with: {
          author: true,
          comments: {
            orderBy: [desc(comments.createdAt)],
            with: {
              author: true
            }
          }
        }
      });
      return post;
    })
});
