import { InferModel } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  lastName: text('last_name'),
});

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, 'insert'>;