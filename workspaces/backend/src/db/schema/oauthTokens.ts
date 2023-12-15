import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { delegates } from "./delegates";
import {InferModel} from "drizzle-orm";

export const oauthTokens = pgTable('oauth_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  delegateId: uuid('delegateId').references(() => delegates.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  token: text('token'),
  tokenSecret: text('tokenSecret'),
  provider: text('provider'), // e.g., 'twitter'
  expiration: timestamp('expiration').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
});

export type OAuthToken = InferModel<typeof oauthTokens>;
export type NewOAuthToken = InferModel<typeof oauthTokens, 'insert'>;
