import { InferModel } from 'drizzle-orm';
import {integer, pgEnum, pgTable, serial, text, timestamp, uuid} from 'drizzle-orm/pg-core';
import { users } from './users';
import { snips } from './snips';

export const voteEnum = pgEnum('vote', ['For', 'Against', 'Abstain']);

export const votes = pgTable('votes', {
  id: serial('id').primaryKey(),

  userId: uuid('user_id').references(() => users.id),
  snipId: integer('snip_id').references(() => snips.id),

  vote: voteEnum('voteType'),

  comment: text('comment'), // Add this line for comments
  voterAddress: text('voterAddress'), // Add this line for comments
  proposalId: text('proposalId'),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Vote = InferModel<typeof votes>;
export type NewVote = InferModel<typeof votes, 'insert'>;
