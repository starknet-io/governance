import {pgTable, text, timestamp, serial, integer} from 'drizzle-orm/pg-core';
import { snips } from './snips';
import {InferModel, relations} from "drizzle-orm";
import {comments} from "./comments";

export const snipVersions = pgTable('snip_versions', {
  id: serial('id').primaryKey(),
  snipId: integer('snipId').references(() => snips.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  title: text('title'),
  discussionURL: text('discussionURL'),
  version: text('version'),
  description: text('description'),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const snipVersionRelations = relations(snipVersions, ({ one, many }) => ({
  snip: one(snips, {
    fields: [snipVersions.snipId],
    references: [snips.id],
  }),
  comments: many(comments),
}));

export type SnipVersion = InferModel<typeof snipVersions>;
export type NewSnipVersion = InferModel<typeof snipVersions, 'insert'>;
