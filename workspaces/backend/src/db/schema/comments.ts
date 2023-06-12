import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  uuid,
} from 'drizzle-orm/pg-core';
import { InferModel } from 'drizzle-orm';
import { users } from './users';
import { posts } from './posts';
import { proposals } from './proposals';
import { pages } from './pages';

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  content: text('content'),

  userId: uuid('user_id').references(() => users.id),
  postId: integer('post_id').references(() => posts.id),
  pageId: integer('page_id').references(() => pages.id),
  proposalId: integer('proposal_id').references(() => proposals.id),

  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Comment = InferModel<typeof comments>;
export type NewComment = InferModel<typeof comments, 'insert'>;
