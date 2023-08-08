import {InferModel, relations} from 'drizzle-orm';
import { pgTable, serial, text, timestamp, uuid} from 'drizzle-orm/pg-core';
import { delegates } from './delegates';

export const customDelegateAgreement = pgTable('custom_delegate_agreement', {
  id: serial('id').primaryKey(),
  delegateId: uuid('delegate_id').references(() => delegates.id),
  content: text('content'),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const customDelegateAgreementRelations = relations(customDelegateAgreement, ({ one }) => ({
  delegate: one(delegates, {
    fields: [customDelegateAgreement.delegateId],
    references: [delegates.id],
  }),
}));


export type CustomDelegateAgreement = InferModel<typeof customDelegateAgreement>;
export type NewCustomDelegateAgreement = InferModel<typeof customDelegateAgreement, 'insert'>;
