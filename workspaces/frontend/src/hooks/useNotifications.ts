import { useEffect, useState } from "react";

// Assuming trpc is correctly configured to point to your backend
import { trpc } from "../utils/trpc";

export function useFetchNotifications() {
  const [notifications, setNotifications] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  // Use trpc hook directly here
  const notificationsQuery = trpc.notifications.getNotificationsForUser.useQuery({});

  useEffect(() => {
    // Check for data or error from the query
    if (notificationsQuery.data) {
      setNotifications(notificationsQuery.data);
      // Store notifications to local storage
      localStorage.setItem(
        "notifications",
        JSON.stringify(notificationsQuery.data),
      );
      setLoading(false);
    }

    if (notificationsQuery.error) {
      setError(notificationsQuery.error);
      setLoading(false);
    }

    // Optionally, set up a polling interval to fetch new notifications periodically
    const intervalId = setInterval(() => {
      // Refetch notifications
      notificationsQuery.refetch();
    }, 10000); // Fetch every 10 seconds

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [notificationsQuery]);

  return { notifications, loading, error };
}
