import { InferModel, relations } from 'drizzle-orm';
import {
  boolean,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const delegateTypeEnum = pgEnum('delegateType', [
  'Cairo Dev',
  'DAOs',
  'Governance',
  'Identity',
  'Infrastructure Starknet Dev',
  'Legal',
  'NFT',
  'Professional Delegates',
  'Security',
  'Starknet Community',
  'Web3 Community',
  'Web3 Developer',
]);

export const delegates = pgTable('delegates', {
  id: uuid('id').primaryKey().defaultRandom(),
  delegateStatement: text('delegateStatement').notNull(),
  delegateType: json('type').default('[]'),
  starknetWalletAddress: text('starknetWalletAddress'),
  twitter: text('twitter'),
  discord: text('discord'),
  discourse: text('discourse'),
  agreeTerms: boolean('agreeTerms'),
  understandRole: boolean('understandRole'),
  userId: uuid('userId').references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const delegateRelations = relations(delegates, ({ one }) => ({
  author: one(users, {
    fields: [delegates.userId],
    references: [users.id],
  }),
}));

export type Delegate = InferModel<typeof delegates>;
export type NewDelegate = InferModel<typeof delegates, 'insert'>;
