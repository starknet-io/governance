import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { InferModel, relations } from 'drizzle-orm';
import { users } from './users';
import { posts } from './posts';
import {comments} from "./comments";

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  message: text('message'),
  userId: uuid('userId').references(() => users.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  time: timestamp('time', { withTimezone: true }).notNull().defaultNow(),
  title: text('title'),
  commentId: integer('comment_id')
    .references(() => comments.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  proposalId: text('proposalId'),
  postId: integer('post_id').references(() => posts.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  type: text('type').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [notifications.postId],
    references: [posts.id],
  }),
  comment: one(comments, {
    fields: [notifications.commentId],
    references: [comments.id],
  })
}));

export type Notification = InferModel<typeof notifications>;
export type NewNotification = InferModel<typeof notifications, 'insert'>;
