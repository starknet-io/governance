import { pgEnum, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';
import { InferModel, relations } from 'drizzle-orm';

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

export const proposals = pgTable('proposals', {
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


export const author = relations(proposals, ({ one }) => ({
  author: one(users, {
    fields: [proposals.userId],
    references: [users.id],
  }),
}));

export type Proposal = InferModel<typeof proposals>;
export type NewProposal = InferModel<typeof proposals, 'insert'>;
