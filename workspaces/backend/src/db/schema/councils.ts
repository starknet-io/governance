import { InferModel, relations } from 'drizzle-orm';
import { pgTable, text, timestamp, serial, boolean } from 'drizzle-orm/pg-core';
import { usersToCouncils } from './usersToCouncils';

export const councils = pgTable('councils', {
  id: serial('id').primaryKey(),
  name: text('name'),
  description: text('description'),
  statement: text('statement'),
  enableUpdate: boolean('enableUpdate').default(false),
  enableComments: boolean('enableComments').default(false),
  slug: text('slug'),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const councilsRelations = relations(councils, ({ many }) => ({
  members: many(usersToCouncils),
}));

export type Space = InferModel<typeof councils>;
export type NewSpace = InferModel<typeof councils, 'insert'>;