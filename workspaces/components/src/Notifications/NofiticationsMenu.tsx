import {
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../Button";
import { Text } from "../Text";
import {
  BellIcon,
  EmailSubscribeIcon,
  NotificationUnreadIcon,
  SuccessIcon,
  WarningIcon,
} from "../Icons";
import { NotificationItem } from "./NotificationItem";
import { EmptyState } from "../EmptyState";
import { trpc } from "@yukilabs/governance-frontend/src/utils/trpc";
import { EmailSubscriptionModal } from "../EmailSubscriptionModal";
import { InfoModal } from "../InfoModal";
import { usePageContext } from "@yukilabs/governance-frontend/src/renderer/PageContextProvider";

type DropdownProps = {
  notifications: any[];
  markAsRead: any;
};

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
        refetchInterval: 10000,
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
export const NotificationsMenu = () => {
  const {
    notifications,
    loading: notificationsLoading,
    error: notificationsError,
    markAsRead,
  } = useFetchNotifications();
  const { user } = usePageContext();
  const [isAllSelected, setIsAllSelected] = useState(true);
  const [isUnreadSelected, setIsUnreadSelected] = useState(false);
  const hasUnread = notifications?.some((notification) => !notification.read);
  const { data: proposals } = trpc.proposals.getProposals.useQuery({});
  const email = trpc.subscriptions.getSubscriberEmailAddress.useQuery();
  const subscribeToEmail = trpc.subscriptions.subscribe.useMutation();
  const unsubscribeToEmail = trpc.subscriptions.unsubscribe.useMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isSubscribedToEmailOpen,
    onOpen: onSubscribedToEmailOpen,
    onClose: onSubscribedToEmailClose,
  } = useDisclosure();
  const {
    isOpen: isUnsubscribedToEmailOpen,
    onOpen: onUnsubscribedToEmailOpen,
    onClose: onUnsubscribedToEmailClose,
  } = useDisclosure();
  const {
    isOpen: isOpenConfirmUnsubscribe,
    onOpen: onOpenConfirmUnsubscribe,
    onClose: onCloseConfirmUnsubscribe,
  } = useDisclosure();

  const handleSubscription = async (data: { email: string }) => {
    try {
      await subscribeToEmail.mutateAsync({
        email: data.email,
      });
      await email.refetch();
      onSubscribedToEmailOpen();
      onClose();
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
  const populatedNotifications = useMemo(() => {
    return notifications.map((notification) => {
      if (notification.proposalId) {
        const foundProposal = (proposals || []).find(
          (proposal) => proposal.id === notification.proposalId,
        );
        return foundProposal
          ? { ...notification, proposal: foundProposal }
          : notification;
      }
      return notification;
    });
  }, [notifications, proposals]);

  const handleConfirmUnsubscribe = async () => {
    try {
      await unsubscribeToEmail.mutateAsync({
        userId: user?.id as string,
      });
      await email.refetch();
      onCloseConfirmUnsubscribe();
      onUnsubscribedToEmailOpen();
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const filteredNotifications = useMemo(() => {
    return isAllSelected
      ? populatedNotifications
      : populatedNotifications.filter((notification) => !notification.read);
  }, [isAllSelected, populatedNotifications]);

  return (
    <>
      <EmailSubscriptionModal
        isOpen={isOpen}
        isLoading={subscribeToEmail.isLoading}
        onClose={onClose}
        saveData={handleSubscription}
      />
      <InfoModal
        title={`Confirmation sent to ${email?.data}`}
        isOpen={isSubscribedToEmailOpen}
        onClose={onSubscribedToEmailClose}
      >
        <Text variant="medium" align="center">
          Follow the instructions in email to complete your subscription
        </Text>
        <Flex alignItems="center" justifyContent={"center"}>
          <SuccessIcon boxSize="84" />
        </Flex>
        <Button variant="primary" onClick={onSubscribedToEmailClose}>
          Close
        </Button>
      </InfoModal>
      <InfoModal
        title={`You’ve successfully unsubscribed
to receive notifications`}
        isOpen={isUnsubscribedToEmailOpen}
        onClose={onUnsubscribedToEmailClose}
      >
        <Flex alignItems="center" justifyContent={"center"}>
          <SuccessIcon boxSize="84" />
        </Flex>
        <Button variant="primary" onClick={onUnsubscribedToEmailClose}>
          Close
        </Button>
      </InfoModal>
      <InfoModal
        title={`Are you sure that you want unsubscribe notifications for ${email?.data}?`}
        isOpen={isOpenConfirmUnsubscribe}
        onClose={onCloseConfirmUnsubscribe}
      >
        <Flex alignItems="center" justifyContent={"center"}>
          <WarningIcon boxSize="84" />
        </Flex>
        <Flex gap="12px">
          <Button
            variant="secondary"
            width={"100%"}
            onClick={onSubscribedToEmailClose}
          >
            Close
          </Button>
          <Button
            variant="primary"
            width={"100%"}
            onClick={handleConfirmUnsubscribe}
          >
            Confirm
          </Button>
        </Flex>
      </InfoModal>
      <Box position="relative">
        <Menu>
          <MenuButton
            as={IconButton}
            width="36px"
            height="36px"
            icon={<BellIcon boxSize="20px" />}
            size="condensed"
            variant="ghost"
          />
          {hasUnread && (
            <Icon
              as={NotificationUnreadIcon}
              position="absolute"
              top="-2px"
              right="-2px"
              boxSize="9px"
            />
          )}
          <Box top="0px" position="relative">
            <MenuList
              h="500px"
              overflowY="scroll"
              w={"400px"}
              borderRadius="8px"
              sx={{
                "@media (max-width: 567px)": {
                  height: "calc(100vh - 58px)",
                  marginTop: "3px",
                  marginLeft: "-48px",
                  borderRadius: 0,
                  width: "100vw",
                },
              }}
            >
              <Flex
                mx={4}
                py={4}
                borderBottom="1px solid"
                alignItems="center"
                justifyContent="space-between"
                borderColor="border.dividers"
              >
                <Text variant="bodyLargeStrong"> Notifications </Text>
                {email?.data && email?.data?.length ? (
                  <Button
                    variant="secondary"
                    size="condensed"
                    onClick={onOpenConfirmUnsubscribe}
                  >
                    <Flex gap={2}>
                      <EmailSubscribeIcon color="content.default.default" />
                      <div>Unsubscribe</div>
                    </Flex>
                  </Button>
                ) : (
                  <Button variant="primary" size="condensed" onClick={onOpen}>
                    <Flex gap={2}>
                      <Icon as={EmailSubscribeIcon} />
                      <div>Subscribe</div>
                    </Flex>
                  </Button>
                )}
              </Flex>
              <Box mx={4} py={4}>
                <Flex gap={2}>
                  <Button
                    variant={isAllSelected ? "primary" : "outline"}
                    size="condensed"
                    borderRadius="999px"
                    onClick={() => {
                      setIsAllSelected(true);
                      setIsUnreadSelected(false);
                    }}
                  >
                    All
                  </Button>
                  <Button
                    variant={isUnreadSelected ? "primary" : "outline"}
                    size="condensed"
                    borderRadius="999px"
                    onClick={() => {
                      setIsAllSelected(false);
                      setIsUnreadSelected(true);
                    }}
                  >
                    Unread
                  </Button>
                </Flex>
              </Box>
              {filteredNotifications && filteredNotifications.length ? (
                filteredNotifications.map((notification) => (
                  <NotificationItem
                    onMarkNotificationRead={(notificationId: string) =>
                      markAsRead(notificationId)
                    }
                    key={notification.id}
                    notification={notification}
                  />
                ))
              ) : (
                <Flex
                  sx={{
                    "@media (max-width: 567px)": {
                      height: "calc(100vh - 207px)",
                    },
                  }}
                >
                  <EmptyState
                    type="notifications"
                    hasBorder={false}
                    title={`No ${
                      isUnreadSelected ? "unread" : ""
                    } notifications yet`}
                    minHeight="300px"
                  />
                </Flex>
              )}
            </MenuList>
          </Box>
        </Menu>
      </Box>
    </>
  );
};
