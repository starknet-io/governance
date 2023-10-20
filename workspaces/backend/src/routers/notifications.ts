// Import necessary modules and schemas
import { router, publicProcedure } from '../utils/trpc';
import { notifications } from '../db/schema/notifications';
import { db } from '../db/db';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { users } from '../db/schema/users';

// Define the notifications router
export const notificationsRouter = router({
  getAll: publicProcedure.query(async () => {
    const allNotifications = await db.query.notifications.findMany({
      with: {
        user: true,
      },
    });
    return allNotifications;
  }),
  // Handler for incoming webhook POST requests
  webhookHandler: publicProcedure
    .input(z.any())

    .mutation(async (opts) => {
      console.log('CAAAAUGGGGHTTTT');
      // Extract relevant data from the webhook request
      const { id, space, event } = opts.input;
      const { author, title, start, id: proposalID } = opts.input.proposal;

      // Create a message for the notification
      const message = `New voting proposal created with ID: ${id} in space: ${space}`;

      const foundUser = await db.query.users.findFirst({
        where: eq(author.toLowerCase(), users.address),
      });

      if (!foundUser) {
        throw new Error('User not found');
      }

      // Insert the new notification
      const insertedNotification = await db
        .insert(notifications)
        .values({
          message,
          type: event,
          title,
          userId: foundUser.id,
          createdAt: new Date(),
        })
        .returning();

      // Get the inserted notification
      const newNotification = insertedNotification[0];
      console.log(newNotification);

      // ... logic for associating the notification with users ...

      // Return the new notification
      return newNotification;
    }),

  // ... other handlers as necessary ...
});
