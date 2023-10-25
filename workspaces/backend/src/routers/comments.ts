import { router, publicProcedure, protectedProcedure } from '../utils/trpc';
import { comments } from '../db/schema/comments';
import { db } from '../db/db';
import { eq, desc, and } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { commentVotes } from '../db/schema/commentVotes';
import { profanity } from '@2toad/profanity';
import { notifications } from '../db/schema/notifications';
import { notificationUsers } from '../db/schema/notificationUsers';

const commentInsertSchema = createInsertSchema(comments);

// list(page, perPage, sortBy, filters)
// commentOnPost(postId, body)
// commentOnProposal(proposalId, body)

export const commentsRouter = router({
  getAll: publicProcedure.query(() => db.select().from(comments)),

  getProposalComments: publicProcedure
    .input(
      z.object({
        proposalId: z.string(),
        sort: z.enum(['upvotes', 'date', '']).optional(),
      }),
    )
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
        where: eq(comments.proposalId, opts.input.proposalId),
        orderBy: orderByClause,
        with: {
          author: true,
          ...(userId && {
            votes: {
              where: eq(commentVotes.userId, userId),
            },
          }),
        },
      });

      function buildCommentTree(parentId: number | null, commentList: any) {
        return commentList
          .filter((comment: any) => comment.parentId === parentId)
          .map((comment: any) => ({
            ...comment,
            netVotes: comment.upvotes - comment.downvotes, // Simple subtraction here
            replies: buildCommentTree(comment.id, commentList),
          }));
      }

      const structuredComments = buildCommentTree(null, rawComments);

      return structuredComments;
    }),

  voteComment: protectedProcedure
    .input(
      z.object({
        commentId: z.number(),
        voteType: z.enum(['upvote', 'downvote']),
      }),
    )
    .mutation(async (opts) => {
      const userId = opts.ctx.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Check if user has already voted on this comment
      const existingVotes = await db
        .select()
        .from(commentVotes)
        .where(
          and(
            eq(commentVotes.userId, userId),
            eq(commentVotes.commentId, opts.input.commentId),
          ),
        );

      const existingVote = existingVotes.length ? existingVotes[0] : undefined;

      await db.transaction(async (trx) => {
        // Fetch the current vote counts
        const currentVotes = await trx
          .select()
          .from(comments)
          .where(eq(comments.id, opts.input.commentId));

        let newUpvotes = currentVotes[0].upvotes;
        let newDownvotes = currentVotes[0].downvotes;

        if (existingVote) {
          // If the existing vote is the same as the new vote, return an error
          if (existingVote.voteType === opts.input.voteType) {
            throw new Error(
              `User has already ${opts.input.voteType}d this comment`,
            );
          }

          // Update the voteType in the commentVotes table
          await trx
            .update(commentVotes)
            .set({
              voteType: opts.input.voteType,
            })
            .where(eq(commentVotes.id, existingVote.id))
            .execute();

          // Adjust the upvotes and downvotes count for the comment
          if (opts.input.voteType === 'upvote') {
            newUpvotes++;
            newDownvotes--;
          } else {
            newUpvotes--;
            newDownvotes++;
          }
        } else {
          // Add new vote
          if (opts.input.voteType === 'upvote') {
            newUpvotes++;
          } else {
            newDownvotes++;
          }

          // Add record to the commentVotes table
          await trx
            .insert(commentVotes)
            .values({
              userId: userId,
              commentId: opts.input.commentId,
              voteType: opts.input.voteType,
            })
            .execute();
        }

        // Update the votes in the database
        await trx
          .update(comments)
          .set({
            upvotes: newUpvotes,
            downvotes: newDownvotes,
          })
          .where(eq(comments.id, opts.input.commentId))
          .execute();
      });

      return { success: true };
    }),

  saveComment: protectedProcedure
    .input(commentInsertSchema.omit({ id: true }))
    .mutation(async (opts) => {
      const commentText = opts.input.content;

      // Check for short comments
      if (commentText.length < 5) {
        throw new Error('Comments must be at least 5 characters long.');
      }

      if (profanity.exists(commentText)) {
        throw new Error('Your comment contains inappropriate language.');
      }

      const lastFiveComments = await db.query.comments.findMany({
        where: eq(comments.userId, opts.ctx.user?.id),
        orderBy: (comments, { desc }) => [desc(comments.createdAt)],
        limit: 5,
      });

      if (lastFiveComments.length >= 5) {
        const oldestCommentTime = lastFiveComments[4].createdAt; // As it's in descending order
        const currentTime = new Date();
        const timeDifference =
          (currentTime.getTime() - new Date(oldestCommentTime).getTime()) /
          1000;
        if (timeDifference < 60) {
          throw new Error(
            'Rate Limit Exceeded: You can post only 5 comments per minute.',
          );
        }
      }

      const insertedComment = await db
        .insert(comments)
        .values({
          ...opts.input,
          userId: opts.ctx.user?.id,
        })
        .returning();

      const parentId = opts.input.parentId;
      if (parentId) {
        const parentComment = await db.query.comments.findFirst({
          where: eq(comments.id, parentId),
          with: { author: true },
        });

        // Step 2: Verify Authorship
        if (parentComment && parentComment.author.id !== opts.ctx.user?.id) {
          const message = opts.input.content;

          // Step 3: Create Notification
          const insertedNotification = await db
            .insert(notifications)
            .values({
              message,
              type: 'comment_reply',
              title: 'New Comment Reply',
              time: new Date(),
              userId: opts.ctx.user?.id,
              createdAt: new Date(),
            })
            .returning();

          // Step 4: Create NotificationUser Entry
          const newNotification = insertedNotification[0];
          const notificationUserAssociation = {
            notificationId: newNotification.id,
            userId: parentComment.author.id,
            read: false,
          };

          await db
            .insert(notificationUsers)
            .values(notificationUserAssociation);
        }
      }

      return insertedComment[0];
    }),

  editComment: protectedProcedure
    .input(commentInsertSchema.required({ id: true }))
    .mutation(async (opts) => {
      const user = opts.ctx.user?.id;
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (profanity.exists(opts.input?.content || '')) {
        throw new Error('Your comment contains inappropriate language.');
      }

      const originalComment = await db
        .select()
        .from(comments)
        .where(eq(comments.id, opts.input.id))
        .execute();
      if (originalComment[0].userId !== user) {
        throw new Error('Permission denied: Can only edit your own comments');
      }

      const updatedComment = await db
        .update(comments)
        .set(opts.input)
        .where(eq(comments.id, opts.input.id))
        .returning();

      return updatedComment[0];
    }),

  deleteComment: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async (opts) => {
      const user = opts.ctx.user;
      if (user?.role !== 'admin' && user?.role !== 'moderator') {
        throw new Error('Permission denied: Only admins can delete comments');
      }

      await db
        .update(comments)
        .set({ isDeleted: true })
        .where(eq(comments.id, opts.input.id))
        .execute();
    }),
});
