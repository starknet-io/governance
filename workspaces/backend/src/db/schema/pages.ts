import { InferModel, relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, uuid, json } from 'drizzle-orm/pg-core';
import { users } from './users';

export const pages = pgTable('pages', {
  id: serial('id').primaryKey(),
  title: text('title'),
  content: text('content'),
  orderNumber: integer('orderNumber'),
  userId: uuid('userId').references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  slug: text('slug').unique(),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const pagesRelations = relations(pages, ({ one }) => ({
  author: one(users, {
    fields: [pages.userId],
    references: [users.id],
  }),
}));

export type Page = InferModel<typeof pages>;
export type NewPage = InferModel<typeof pages, 'insert'>;
