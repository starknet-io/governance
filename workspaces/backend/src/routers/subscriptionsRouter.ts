import {router, protectedProcedure, hasPermission} from '../utils/trpc';
import { db } from '../db/db';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { subscribers } from '../db/schema/subscribers';
import { eq } from 'drizzle-orm';
import Mailgun from 'mailgun.js';
import formData from 'form-data';
import { getUrlBasedOnHost } from '../utils/helpers';
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY!,
});

export const subscriptionsRouter = router({
  // Endpoint to subscribe a user to emails
  subscribe: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async (opts) => {
      const { id: userId } = opts.ctx.user;
      const { req } = opts.ctx;
      const { email } = opts.input;

      if (!userId) {
        throw new Error('Unauthorized');
      }

      // Check if user is already subscribed
      const existingSubscription = await db.query.subscribers.findFirst({
        where: eq(subscribers.userId, userId),
      });

      if (existingSubscription) {
        throw new Error('User is already subscribed');
      }

      // Insert a new subscription record
      const newSubscription = await db
        .insert(subscribers)
        .values({
          email,
          confirmationToken: uuidv4(),
          userId,
        })
        .returning();
      const mailgunDomain = process.env.MAILGUN_DOMAIN || '';
      const withEmailMailgunDomain = `@${mailgunDomain}`;
      const hostname = getUrlBasedOnHost(req.host);

      if (newSubscription && newSubscription[0]) {
        await mg.messages.create(mailgunDomain, {
          from: `Governance Hub <me${withEmailMailgunDomain}>`,
          to: email,
          subject: 'Confirm Subscription',
          template: 'confirm email address',
          'h:X-Mailgun-Variables': JSON.stringify({
            url: `${hostname}subscription/confirm/${newSubscription[0].confirmationToken}`,
          }),
        });
      }

      return newSubscription[0];
    }),
  // New endpoint to confirm a subscription
  confirmSubscription: protectedProcedure
    .input(
      z.object({
        confirmationToken: z.string().uuid(),
      }),
    )
    .mutation(async (opts) => {
      const { confirmationToken } = opts.input;

      const subscription = await db.query.subscribers.findFirst({
        where: eq(subscribers.confirmationToken, confirmationToken),
      });

      if (!subscription) {
        throw new Error('Invalid confirmation token');
      }

      await db
        .update(subscribers)
        .set({ isConfirmed: true, confirmationToken: uuidv4() }) // Confirm and regenerate token
        .where(eq(subscribers.confirmationToken, confirmationToken));

      return subscription.email;
    }),

  confirmUnsubscription: protectedProcedure
    .input(
      z.object({
        confirmationToken: z.string().uuid(),
      }),
    )
    .mutation(async (opts) => {
      const { confirmationToken } = opts.input;

      const subscription = await db.query.subscribers.findFirst({
        where: eq(subscribers.confirmationToken, confirmationToken),
      });

      const email = subscription?.email || ""

      if (!subscription) {
        throw new Error('Invalid confirmation token');
      }

      await db
        .delete(subscribers)
        .where(eq(subscribers.confirmationToken, confirmationToken));

      return email
    }),

  // Endpoint to unsubscribe a user from emails
  unsubscribe: protectedProcedure
    .input(
      z.object({
        userId: z.string()
      }),
    )
    .use(hasPermission)
    .mutation(async (opts) => {
      const { id: userId } = opts.ctx.user;

      if (!userId) {
        throw new Error('Unauthorized');
      }

      // If email is provided, use it to find subscription, otherwise use userId
      const condition = eq(subscribers.userId, userId);

      // Delete the subscription record
      await db.delete(subscribers).where(condition).execute();

      return { success: true };
    }),
  // Endpoint to get a subscriber's email address
  getSubscriberEmailAddress: protectedProcedure.query(async (opts) => {
    const { id: userId, confirmationToken } = opts.ctx.user;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    let subscriber = null;

    if (userId) {
      subscriber = await db.query.subscribers.findFirst({
        where: eq(subscribers.userId, userId),
      });
    } else if (confirmationToken) {
      subscriber = await db.query.subscribers.findFirst({
        where: eq(subscribers.confirmationToken, confirmationToken),
      });
    }

    if (!subscriber) {
      return null
    }

    return subscriber.email;
  }),
});
