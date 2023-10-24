import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { InferModel, relations } from 'drizzle-orm';
import { users } from './users';

export const notificationType = pgEnum('type', [
  'proposal/created',
  'proposal/start',
  'proposal/end',
  'proposal/deleted',
  'comment',
]);

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  message: text('message'),
  userId: uuid('userId').references(() => users.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  time: timestamp('time', { withTimezone: true }).notNull().defaultNow(),
  title: text('title'),
  proposalId: text('proposalId'),
  type: notificationType('type').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export type Notification = InferModel<typeof notifications>;
export type NewNotification = InferModel<typeof notifications, 'insert'>;
