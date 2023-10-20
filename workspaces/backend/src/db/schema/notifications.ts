import {pgTable, text, timestamp, uuid} from "drizzle-orm/pg-core";
import {InferModel} from "drizzle-orm";

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  message: text('message').notNull(),
  type: text('type').notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Notification = InferModel<typeof notifications>;
export type NewNotification = InferModel<typeof notifications, 'insert'>;
