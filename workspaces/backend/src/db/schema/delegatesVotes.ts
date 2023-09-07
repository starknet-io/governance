import { pgTable, uuid, integer, timestamp } from 'drizzle-orm/pg-core';
import {delegates} from "./delegates";
import {InferModel} from "drizzle-orm";

export const delegateVotes = pgTable('delegate_votes', {
  delegateId: uuid('delegateId').references(() => delegates.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  votingPower: integer('votingPower').notNull(),
  totalVotes: integer('totalVotes').notNull(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
export type DelegateVote = InferModel<typeof delegateVotes>;
export type NewDelegateVote = InferModel<typeof delegateVotes, 'insert'>;
