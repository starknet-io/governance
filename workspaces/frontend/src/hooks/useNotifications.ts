import { useEffect, useState } from "react";

// Assuming trpc is correctly configured to point to your backend
import { trpc } from "../utils/trpc";

export function useFetchNotifications() {
  const [notifications, setNotifications] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const markNotificationAsRead =
    trpc.notifications.markNotificationAsRead.useMutation({});

  // Use trpc hook directly here
  const notificationsQuery =
    trpc.notifications.getNotificationsForUser.useQuery(
      {},
      {
        refetchInterval: 50000,
        refetchIntervalInBackground: true,
      },
    );

  const markAsRead = async (notificationId: string) => {
    // Update local state
    // Call the backend to update the read status
    try {
      await markNotificationAsRead.mutateAsync(
        {
          notificationId,
        },
        {
          onSuccess: () => {
            notificationsQuery.refetch();
          },
        },
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Optionally, revert the local state update if the backend call fails
    }
  };

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
  }, [notificationsQuery]);

  return { notifications, loading, error, markAsRead };
}
