import {integer, pgEnum, pgTable, serial, timestamp, uuid} from 'drizzle-orm/pg-core';
import { users } from './users';
import { comments } from './comments';
import { relations } from 'drizzle-orm';

export const voteTypeEnum = pgEnum('voteType', ['upvote', 'downvote']);


export const commentVotes = pgTable('comment_votes', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull(),
  commentId: integer('comment_id')
    .references(() => comments.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull(),
  voteType: voteTypeEnum('vote_type').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const commentVotesRelations = relations(commentVotes, ({ one }) => ({
  user: one(users, {
    fields: [commentVotes.userId],
    references: [users.id],
  }),
  comment: one(comments, {
    fields: [commentVotes.commentId],
    references: [comments.id],
  }),
}));
