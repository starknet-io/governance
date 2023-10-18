import { InferModel } from 'drizzle-orm'
import { serial, text, pgEnum, timestamp } from 'drizzle-orm/pg-core';
import {pgTable} from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum('category', ['category1', 'category2', 'category3']);

export const proposals = pgTable('proposals', {
  id: serial('id').primaryKey(),
  proposalId: text('proposal_id').notNull(), // Changed from uuid to text
  category: categoryEnum('category'),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Proposal = InferModel<typeof proposals>;
export type NewProposal = InferModel<typeof proposals, 'insert'>;
