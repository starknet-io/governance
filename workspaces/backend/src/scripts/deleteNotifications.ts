import { db } from '../db/db';
import {notifications} from "../db/schema/notifications";

async function deleteAllNotifications() {
  try {
    // Delete all notifications
    // The cascade delete option will automatically remove associated entries
    // in the notificationUsers table.
    await db.delete(notifications).execute();

    console.log(`Deleted notifications.`);
  } catch (error) {
    console.error('Error deleting notifications:', error);
  }
}

deleteAllNotifications();
