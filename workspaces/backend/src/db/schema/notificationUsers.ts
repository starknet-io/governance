import { pgTable, uuid, boolean } from 'drizzle-orm/pg-core';
import { notifications } from './notifications';
import { delegates } from './delegates';
import { InferModel, relations } from 'drizzle-orm';
import { users } from './users';

export const notificationUsers = pgTable('notification_users', {
  notificationId: uuid('notificationId').references(() => notifications.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  userId: uuid('userId').references(() => delegates.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  read: boolean('read').notNull().default(false),
});

export const notificationUsersRelations = relations(
  notificationUsers,
  ({ one }) => ({
    user: one(users, {
      fields: [notificationUsers.userId],
      references: [users.id],
    }),
  }),
);

export type NotificationUsers = InferModel<typeof notificationUsers>;
export type NewNotificationUsers = InferModel<
  typeof notificationUsers,
  'insert'
>;
