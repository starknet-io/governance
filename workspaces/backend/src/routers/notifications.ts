// Import necessary modules and schemas
import { router, publicProcedure } from '../utils/trpc';
import { notifications } from '../db/schema/notifications';
import { db } from '../db/db';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { users } from '../db/schema/users';
import { notificationUsers } from '../db/schema/notificationUsers';

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
      console.log(id, space, event, author, title, start, proposalID)

      // Create a message for the notification
      const message = `New voting proposal created with ID: ${id} in space: ${space}`;

      const foundUser = await db.query.users.findFirst({
        where: eq(author.toLowerCase(), users.address),
      });

      if (!foundUser) {
        throw new Error('User not found');
      }

      console.log('Trying to insert', {
        message,
        event,
        title,
        proposalID,
        time: new Date(start),
        userId: foundUser.id,
        createdAt: new Date(),
      })
      try {
        // Insert the new notification
        const insertedNotification = await db
          .insert(notifications)
          .values({
            message,
            type: event,
            title,
            proposalId: proposalID,
            time: new Date(start * 1000),
            userId: foundUser.id,
            createdAt: new Date(),
          })
          .returning();
      } catch (err) {
        console.log(err)
      }

      // Get the inserted notification
      const newNotification = insertedNotification[0];
      console.log(newNotification);

      // Get all users who should be associated with this notification
      const allUsers = await db.query.users.findMany();

      // Associate each user with the new notification
      const notificationUserAssociations = allUsers.map((user) => ({
        notificationId: newNotification.id,
        userId: user.id,
        read: false, // All users initially have not read the notification
      }));

      // Insert all associations into the notification_users table
      await db.insert(notificationUsers).values(notificationUserAssociations);

      return newNotification;
    }),

  // ... other handlers as necessary ...
});
