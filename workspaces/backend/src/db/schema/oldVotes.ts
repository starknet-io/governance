import {InferSelectModel, relations} from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { delegates } from './delegates';

export const oldVotes = pgTable('old_votes', {
  id: serial('id').primaryKey(),
  delegateId: uuid('delegateId').references(() => delegates.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  proposalId: text('proposalId'),
  title: text('title'),
  body: text('body'),
  votePreference: integer('votePreference'),
  voteCount: integer('voteCount'),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const oldVotesRelations = relations(oldVotes, ({ one }) => ({
  author: one(delegates, {
    fields: [oldVotes.delegateId],
    references: [delegates.id],
  }),
}));

export type OldVote = InferSelectModel<typeof oldVotes>;
