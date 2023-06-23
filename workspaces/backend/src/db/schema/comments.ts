import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  uuid,
} from 'drizzle-orm/pg-core';
import { InferModel, relations } from 'drizzle-orm';
import { users } from './users';
import { posts } from './posts';
import { snips } from './snips';
import { pages } from './pages';

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  content: text('content'),

  userId: uuid('user_id').references(() => users.id),
  postId: integer('post_id').references(() => posts.id),
  pageId: integer('page_id').references(() => pages.id),
  snipId: integer('snip_id').references(() => snips.id),
  proposalId: text('proposal_id'),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const commentsRelations = relations(comments, ({ one }) => ({
  author: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  snips: one(snips, {
    fields: [comments.snipId],
    references: [snips.id],
  }),
}));

export type Comment = InferModel<typeof comments>;
export type NewComment = InferModel<typeof comments, 'insert'>;
