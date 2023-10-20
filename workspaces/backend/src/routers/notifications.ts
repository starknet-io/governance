// Import necessary modules and schemas
import { router, publicProcedure } from '../utils/trpc';
import { notifications } from '../db/schema/notifications';
import { db } from '../db/db';
import { z } from 'zod';

// Define the notifications router
export const notificationsRouter = router({

  // Handler for incoming webhook POST requests
  webhookHandler: publicProcedure
    .input(z.object({
      id: z.string(),
      space: z.string(),
      event: z.string(),
      expire: z.number().optional(),
    }))
    .mutation(async (opts) => {
      console.log("CAAAAUGGGGHTTTT")
      // Extract relevant data from the webhook request
      const { id, space, event } = opts.input;

      // Create a message for the notification
      const message = `New voting proposal created with ID: ${id} in space: ${space}`;

      // Insert the new notification
      const insertedNotification = await db
        .insert(notifications)
        .values({
          message,
          type: event,
          createdAt: new Date(),
        })
        .returning();

      // Get the inserted notification
      const newNotification = insertedNotification[0];
      console.log(newNotification)

      // ... logic for associating the notification with users ...

      // Return the new notification
      return newNotification;
    }),

  // ... other handlers as necessary ...

});
