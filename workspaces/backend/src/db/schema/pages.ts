import { InferModel } from 'drizzle-orm';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const pages = pgTable('pages', {
  id: serial('id').primaryKey(),
  title: text('title'),
  content: text('content'),

  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Page = InferModel<typeof pages>;
export type NewPage = InferModel<typeof pages, 'insert'>;
