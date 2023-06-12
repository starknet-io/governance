import { InferModel } from 'drizzle-orm';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const councils = pgTable('councils', {
  id: serial('id').primaryKey(),
  name: text('name'),

  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Space = InferModel<typeof councils>;
export type NewSpace = InferModel<typeof councils, 'insert'>;
