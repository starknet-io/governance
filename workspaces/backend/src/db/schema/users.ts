import { InferModel, relations } from 'drizzle-orm';
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
} from 'drizzle-orm/pg-core';
import { delegates } from './delegates';
import { usersToCouncils } from './usersToCouncils';
import { posts } from './posts';
import { pages } from './pages';

export const userRoleEnum = pgEnum('role', ['user', 'admin', 'moderator']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  address: text('address').notNull(),
  walletName: text('walletName'),
  walletProvider: text('walletProvider'),
  publicIdentifier: text('publicIdentifier'),
  dynamicId: text('dynamicId'),
  role: userRoleEnum('role').notNull().default('user'),
  ensName: text('ensName'),
  ensAvatar: text('ensAvatar'),
  name: text('name'),
  twitter: text('twitter'),
  miniBio: text('miniBio'),
  username: text('username'),
  starknetAddress: text('starknetAddress'),
  profileImage: text('profileImage'),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const userDelegate = relations(users, ({ one, many }) => ({
  delegationStatement: one(delegates, {
    fields: [users.id],
    references: [delegates.userId],
  }),
  councils: many(usersToCouncils),
  posts: many(posts),
  pages: many(pages),
}));

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, 'insert'>;
