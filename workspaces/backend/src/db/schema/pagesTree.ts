import { InferModel, relations } from 'drizzle-orm';
import { pgTable, serial, timestamp, uuid, json, integer } from 'drizzle-orm/pg-core';
import { users } from './users';
import { pages } from './pages';

export const pagesTree = pgTable('pagesTree', {
  id: serial('id').primaryKey(),
  userId: uuid('userId').references(() => users.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  pageId: integer('pageId').references(() => pages.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  children: json('children').default('[]'),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const pagesTreeRelations = relations(pagesTree, ({ one }) => ({
  author: one(users, {
    fields: [pagesTree.userId],
    references: [users.id],
  }),
  page: one(pages, {
    fields: [pagesTree.pageId],
    references: [pages.id],
  }),
}));

export type PageTree = InferModel<typeof pagesTree>;
export type NewPageTree = InferModel<typeof pagesTree, 'insert'>;
