import { InferModel, relations } from 'drizzle-orm';
import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { delegates } from './delegates';

export const userRoleEnum = pgEnum('role', ['user', 'admin']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  address: text('address').notNull(),
  walletName: text('walletName'),
  walletProvider: text('walletProvider'),
  publicIdentifier: text('publicIdentifier'),
  dynamicId: text('dynamicId'),
  role: userRoleEnum('role').notNull().default('user'),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const userDelegate = relations(users, ({ one }) => ({
  delegationStatement: one(delegates, {
    fields: [users.id],
    references: [delegates.userId],
  }),
}));

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, 'insert'>;
