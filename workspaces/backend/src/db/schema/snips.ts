import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { InferModel, relations } from 'drizzle-orm';
import { snipVersions } from './snipVersions';

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
  latestVersionId: integer('latestVersionId').references(() => snipVersions.id, {
    onDelete: 'set null',
    onUpdate: 'cascade',
  }),
  status: proposalStatus('status'),
  title: text('title'),
  description: text('description'),
  discussionURL: text('discussionURL'),
  userId: uuid('userId').references(() => users.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),

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
  latestVersion: one(snipVersions, {
    fields: [snips.latestVersionId],
    references: [snipVersions.id],
  }),
  versions: many(snipVersions),
}));

export type Snip = InferModel<typeof snips>;
export type NewSnip = InferModel<typeof snips, 'insert'>;
