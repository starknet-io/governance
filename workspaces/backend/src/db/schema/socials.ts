import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { InferModel } from 'drizzle-orm';
import {delegates} from "./delegates";


export const socials = pgTable('delegate_socials', {
  id: uuid('id').primaryKey().defaultRandom(),
  delegateId: uuid('delegateId').references(() => delegates.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  twitter: text('twitter'),
  discord: text('discord'),
  telegram: text('telegram'),
  discourse: text('discourse'),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull().defaultNow(),
});

export type DelegateSocial = InferModel<typeof socials>;
export type NewDelegateSocial = InferModel<typeof socials, 'insert'>;
