import { pgTable, primaryKey, serial, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { councils } from "./councils";
import { relations } from "drizzle-orm";

export const usersToCouncils = pgTable('users_to_councils', {
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  councilId: serial('council_id').notNull().references(() => councils.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
}, (t) => ({
  pk: primaryKey(t.userId, t.councilId),
}),
);

export const usersToGroupsRelations = relations(usersToCouncils, ({ one }) => ({
  group: one(councils, {
    fields: [usersToCouncils.councilId],
    references: [councils.id],
  }),
  user: one(users, {
    fields: [usersToCouncils.userId],
    references: [users.id],
  }),
}));