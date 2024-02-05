import {pgTable, uuid, integer, timestamp, text} from 'drizzle-orm/pg-core';
import {delegates} from "./delegates";
import {InferModel} from "drizzle-orm";

export const delegateVotes = pgTable('delegate_votes', {
  delegateId: uuid('delegateId').references(() => delegates.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  votingPowerLayerOne: integer('votingPowerLayerOne').default(0),
  votingPowerLayerTwo: integer('votingPowerLayerTwo').default(0),
  totalVotesLayerOne: integer('totalVotesLayerOne').default(0),
  totalVotesLayerTwo: integer('totalVotesLayerTwo').default(0),
  address: text('address').notNull(),
  votingPower: integer('votingPower'),
  totalVotes: integer('totalVotes'),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
export type DelegateVote = InferModel<typeof delegateVotes>;
export type NewDelegateVote = InferModel<typeof delegateVotes, 'insert'>;
