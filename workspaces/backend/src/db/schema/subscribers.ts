import { pgTable, uuid, timestamp, text, boolean } from 'drizzle-orm/pg-core';
import { InferModel } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { users } from './users';

export const subscribers = pgTable('subscribers', {
  email: text('email').notNull(),
  userId: uuid('userId').references(() => users.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  confirmationToken: uuid('confirmationToken').notNull().default(uuidv4()),
  isConfirmed: boolean('isConfirmed').notNull().default(false),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Subscribers = InferModel<typeof subscribers>;
export type NewSubscribers = InferModel<typeof subscribers, 'insert'>;
