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
import { commentVotes } from './commentVotes';

// TODO fix circular dependency
export const comments:any = pgTable('comments', {
  id: serial('id').primaryKey(),
  content: text('content'),
  userId: uuid('user_id').references(() => users.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  postId: integer('post_id').references(() => posts.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  pageId: integer('page_id').references(() => pages.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  snipId: integer('snip_id').references(() => snips.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  proposalId: text('proposal_id'),
  parentId: integer('parent_id').references(() => comments.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  upvotes: integer('upvotes').default(0),
  downvotes: integer('downvotes').default(0),
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
  posts: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  votes: one(commentVotes, {
    fields: [comments.id],
    references: [commentVotes.commentId],
  }),
}));

export type Comment = InferModel<typeof comments>;
export type NewComment = InferModel<typeof comments, 'insert'>;
