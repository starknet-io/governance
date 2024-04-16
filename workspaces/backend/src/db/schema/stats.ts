import { InferModel } from 'drizzle-orm';
import {pgTable, serial, timestamp, text} from 'drizzle-orm/pg-core';

export const stats = pgTable('stats', {
  id: serial('id').primaryKey(),
  delegatedVSTRK: text('delegatedVSTRK', ).default("0"),
  delegatedSTRK: text('delegatedSTRK', ).default("0"),
  selfDelegated: text('selfDelegated', ).default("0"),
  totalVotingPower: text('totalVotingPower').default("0"),
  selfDelegatedTotal: text('selfDelegatedTotal').default("0"),
  totalVoters: text('totalVoters').default("0"),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Stats = InferModel<typeof stats>;
export type NewStat = InferModel<typeof stats, 'insert'>;
