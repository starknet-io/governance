import { router, protectedProcedure } from '../utils/trpc';
import { db } from '../db/db';
import { z } from 'zod';
import { subscribers } from '../db/schema/subscribers';
import { eq } from 'drizzle-orm';

export const subscriptionsRouter = router({
  // Endpoint to subscribe a user to emails
  subscribe: protectedProcedure
    .input(z.object({
      email: z.string().email(),
    }))
    .mutation(async (opts) => {
      const { id: userId } = opts.ctx.user;
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
          userId,
        })
        .returning();

      return newSubscription[0];
    }),

  // Endpoint to unsubscribe a user from emails
  unsubscribe: protectedProcedure
    .input(z.object({
      email: z.string().email().optional(),
    }))
    .mutation(async (opts) => {
      const { id: userId } = opts.ctx.user;
      const { email } = opts.input;

      if (!userId) {
        throw new Error('Unauthorized');
      }

      // If email is provided, use it to find subscription, otherwise use userId
      const condition = email ? eq(subscribers.email, email) : eq(subscribers.userId, userId);

      // Delete the subscription record
      await db
        .delete(subscribers)
        .where(condition)
        .execute();

      return { success: true };
    }),
});
