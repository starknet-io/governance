import { InferModel } from 'drizzle-orm';
import {
  boolean,
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
  delegateType: delegateTypeEnum('delegateType'),
  starknetWalletAddress: text('starknetWalletAddress'),
  twitter: text('twitter'),
  discord: text('discord'),
  discourse: text('discourse'),
  agreeTerms: boolean('agreeTerms'),
  understandRole: boolean('understandRole'),
  userId: uuid('userId').references(() => users.id),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Delegate = InferModel<typeof delegates>;
export type NewDelegate = InferModel<typeof delegates, 'insert'>;
