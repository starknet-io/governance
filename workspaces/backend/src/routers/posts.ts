import { router, publicProcedure, protectedProcedure } from '../utils/trpc';
import { posts } from '../db/schema/posts';
import { db } from '../db/db';
import { desc, eq, and } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { comments } from '../db/schema/comments';
import { commentVotes } from "../db/schema/commentVotes";
import { z } from "zod";
import slugify from 'slugify';
import { councils } from '../db/schema/councils';

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
          slug: slugify(opts.input.title ?? '', {
            replacement: '_',
            lower: true,
          }),
          createdAt: new Date(),
          userId: opts.ctx.user?.id
        })
        .returning();

      return insertedPost[0];
    }),

  getPostComments: publicProcedure
    .input(z.object({ postId: z.number(), sort: z.enum(['upvotes', 'date']).optional() }))
    .query(async (opts) => {
      const userId = opts.ctx.user?.id || null;

      const orderByClause = [];
      if (opts.input.sort === 'upvotes') {
        orderByClause.push(desc(comments.upvotes));
      } else {
        // default to date sorting if no sort is provided or if it's 'date'
        orderByClause.push(desc(comments.createdAt));
      }

      const rawComments = await db.query.comments.findMany({
        where: eq(comments.postId, opts.input.postId),
        orderBy: orderByClause,
        with: {
          author: true,
          ...userId && {
            votes: {
              where: eq(commentVotes.userId, userId)
            }
          }
        },
      });

      function buildCommentTree(parentId: number | null, commentList: any) {
        return commentList
          .filter((comment: any) => comment.parentId === parentId)
          .map((comment: any) => ({
            ...comment,
            netVotes: comment.upvotes - comment.downvotes,
            replies: buildCommentTree(comment.id, commentList),
          }));
      }

      const structuredComments = buildCommentTree(null, rawComments);

      return structuredComments;
    }),

  editPost: protectedProcedure
    .input(postInsertSchema.required({ id: true }))
    .mutation(async (opts) => {
      const updatedPost = await db
        .update(posts)
        .set({
          ...opts.input,
          slug: slugify(opts.input.title ?? '', {
            replacement: '_',
            lower: true,
          }),
        })
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
    }),

  getPostBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async (opts) => {
      const post = await db.query.posts.findMany({
        where: eq(posts.slug, opts.input.slug),
        with: {
          council: true,
          author: true,
          comments: {
            orderBy: [desc(comments.createdAt)],
            with: {
              author: true
            }
          }
        }
      });
      return post[0];
    })
});
