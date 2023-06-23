import { pgEnum, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';
import { InferModel, relations } from 'drizzle-orm';
import { comments } from './comments';

export const proposalType = pgEnum('type', ['snip', 'vote']);
export const proposalStatus = pgEnum('status', [
  'Draft',
  'Review',
  'Last Call',
  'Final',
  'Stagnant',
  'Withdrawn',
  'Living',
]);

export const snips = pgTable('snips', {
  id: serial('id').primaryKey(),
  type: proposalType('type'),
  status: proposalStatus('status'),
  title: text('title'),
  description: text('description'),
  discussionURL: text('discussionURL'),
  userId: uuid('userId').references(() => users.id),

  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const proposalRelations = relations(snips, ({ one, many }) => ({
  author: one(users, {
    fields: [snips.userId],
    references: [users.id],
  }),
  comments: many(comments),
}));

export type Snip = InferModel<typeof snips>;
export type NewSnip = InferModel<typeof snips, 'insert'>;
