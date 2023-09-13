import {pgTable, uuid, integer, timestamp, text} from 'drizzle-orm/pg-core';
import {delegates} from "./delegates";
import {InferModel} from "drizzle-orm";

export const delegateVotes = pgTable('delegate_votes', {
  delegateId: uuid('delegateId').references(() => delegates.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  address: text('address').notNull(),
  votingPower: integer('votingPower'),
  totalVotes: integer('totalVotes'),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
export type DelegateVote = InferModel<typeof delegateVotes>;
export type NewDelegateVote = InferModel<typeof delegateVotes, 'insert'>;
