import { InferModel, relations } from 'drizzle-orm';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { councils } from './councils';
import { comments } from './comments';
import { users } from './users';

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title'),
  content: text('content'),
  councilId: text('councilId'),
  userId: text('userId'),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  council: one(councils, {
    fields: [posts.councilId],
    references: [councils.id],
  }),
  comments: many(comments),
  author: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));

export type Post = InferModel<typeof posts>;
export type NewPost = InferModel<typeof posts, 'insert'>;
