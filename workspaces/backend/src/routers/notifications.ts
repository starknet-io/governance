import { router, publicProcedure, protectedProcedure } from '../utils/trpc';
import { notifications } from '../db/schema/notifications';
import { db } from '../db/db';
import { z } from 'zod';
import { and, desc, eq } from 'drizzle-orm';
import { users } from '../db/schema/users';
import { notificationUsers } from '../db/schema/notificationUsers';


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

        // Get the inserted notification
        const newNotification = insertedNotification[0];
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
      } catch (err) {
        console.log(err);
        return false;
      }
    }),

  getNotificationsForUser: protectedProcedure
    .input(
      z.object({
        address: z.string().optional(),
      }),
    )
    .query(async (opts) => {
      const { id: userId } = opts.ctx.user;

      if (!userId) {
        throw Error('Unauthorized');
      }

      // Query the notification_users table to get notifications for the user
      const userNotifications = await db.query.notificationUsers.findMany({
        where: eq(userId, notificationUsers.userId),
        orderBy: [desc(notificationUsers.createdAt)],

        with: {
          notification: {
            with: {
              user: true,
            },
            orderBy: [desc(notifications.time)],
          },
        },
      });

      // Transform the data to the desired output format
      const returnedNotifications = userNotifications.map((notifUser) => ({
        ...notifUser.notification,
        read: notifUser.read,
      }));

      return returnedNotifications;
    }),

  markNotificationAsRead: protectedProcedure
    .input(
      z.object({
        notificationId: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const { id: userId } = opts.ctx.user;
      const { notificationId } = opts.input;

      if (!userId) {
        throw Error('Unauthorized');
      }

      // Update the read field in the notification_users table
      await db
        .update(notificationUsers)
        .set({ read: true })
        .where(
          and(
            eq(notificationUsers.notificationId, notificationId),
            eq(notificationUsers.userId, userId),
          ),
        );

      return true;
    }),
});
