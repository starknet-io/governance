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
import {customDelegateAgreement} from "./customDelegateAgreement";
import { delegateVotes } from "./delegatesVotes";
import {socials} from "./socials";

export const interestsEnum = pgEnum('interests', [
  // 'Cairo Dev',
  // 'DAOs',
  // 'Governance',
  // 'Identity',
  // 'Infrastructure Starknet Dev',
  // 'Legal',
  // 'NFT',
  // 'Professional Delegates',
  // 'Security',
  // 'Starknet Community',
  // 'Web3 Community',
  // 'Web3 Developer',
  'cairo_dev',
  'daos',
  'governance',
  'identity',
  'infrastructure',
  'legal',
  'professional_delegate',
  'security',
  'starknet_community',
  'web3_community',
  'web3_developer',
  'nft',
  'gaming',
  'defi',
  'build',
]);

export const delegates = pgTable('delegates', {
  id: uuid('id').primaryKey().defaultRandom(),
  statement: text('statement').notNull(),
  interests: json('interests').default('[]'),
  twitter: text('twitter'),
  telegram: text('telegram'),
  discord: text('discord'),
  discourse: text('discourse'),
  confirmDelegateAgreement: boolean('confirmDelegateAgreement'),
  isKarmaDelegate: boolean('isKarmaDelegate'),
  isGovernanceDelegate: boolean('isGovernanceDelegate'),
  agreeTerms: boolean('agreeTerms'),
  understandRole: boolean('understandRole'),
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

export const delegateRelations = relations(delegates, ({ one }) => ({
  author: one(users, {
    fields: [delegates.userId],
    references: [users.id],
  }),
  customAgreement: one(customDelegateAgreement, {
    fields: [delegates.id],
    references: [customDelegateAgreement.delegateId],
  }),
  delegateVotes: one(delegateVotes, {
    fields: [delegates.id],
    references: [delegateVotes.delegateId],
  }),
  socials: one(socials, {
    fields: [delegates.id],
    references: [socials.delegateId]
  })
}));

export type Delegate = InferModel<typeof delegates>;
export type NewDelegate = InferModel<typeof delegates, 'insert'>;
