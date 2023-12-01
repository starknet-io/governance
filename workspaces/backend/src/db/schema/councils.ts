import { InferModel, relations } from 'drizzle-orm';
import { pgTable, text, timestamp, serial } from 'drizzle-orm/pg-core';
import { posts } from './posts';
import {members} from "./members";

export const councils = pgTable('councils', {
  id: serial('id').primaryKey(),
  name: text('name'),
  description: text('description'),
  statement: text('statement'),
  slug: text('slug'),
  address: text('address'),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const councilsRelations = relations(councils, ({ many }) => ({
  members: many(members),
  posts: many(posts),
}));

export type Space = InferModel<typeof councils>;
export type NewSpace = InferModel<typeof councils, 'insert'>;
