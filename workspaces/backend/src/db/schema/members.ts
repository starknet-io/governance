import { InferModel, relations } from 'drizzle-orm';
import {integer, pgTable, serial, text} from 'drizzle-orm/pg-core';
import { councils } from './councils';

export const members = pgTable('members', {
  id: serial('id').primaryKey(),
  address: text('address'),
  twitter: text('twitter'),
  miniBio: text('miniBio'),
  name: text('name'),
  councilId: integer('council_id').references(() => councils.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
});

export const membersRelations = relations(members, ({ one }) => ({
  author: one(councils, {
    fields: [members.councilId],
    references: [councils.id],
  }),
}));

export type Member = InferModel<typeof members>;
export type NewMember = InferModel<typeof members, 'insert'>;
