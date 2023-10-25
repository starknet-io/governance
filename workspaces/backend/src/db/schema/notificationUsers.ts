import { pgTable, uuid, boolean, timestamp } from 'drizzle-orm/pg-core';
import { notifications } from './notifications';
import { InferModel, relations } from 'drizzle-orm';
import { users } from './users';

export const notificationUsers = pgTable('notification_users', {
  notificationId: uuid('notificationId').references(() => notifications.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
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
  read: boolean('read').notNull().default(false),
});

export const notificationUsersRelations = relations(
  notificationUsers,
  ({ one }) => ({
    user: one(users, {
      fields: [notificationUsers.userId],
      references: [users.id],
    }),
    notification: one(notifications, {
      fields: [notificationUsers.notificationId],
      references: [notifications.id],
    }),
  }),
);

export type NotificationUsers = InferModel<typeof notificationUsers>;
export type NewNotificationUsers = InferModel<
  typeof notificationUsers,
  'insert'
>;
