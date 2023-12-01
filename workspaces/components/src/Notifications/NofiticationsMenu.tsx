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
import { useMemo, useState } from "react";
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

type DropdownProps = {
  notifications: any[];
  markAsRead: any;
};
export const NotificationsMenu = ({
  notifications,
  markAsRead,
}: DropdownProps) => {
  const [isAllSelected, setIsAllSelected] = useState(true);
  const [isUnreadSelected, setIsUnreadSelected] = useState(false);
  const hasUnread = notifications.some((notification) => !notification.read);
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
        email: email.data as string,
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
                <Box>
                  <EmptyState
                    type="notifications"
                    hasBorder={false}
                    title={`No ${
                      isUnreadSelected ? "unread" : ""
                    } notifications yet`}
                    minHeight="300px"
                  />
                </Box>
              )}
            </MenuList>
          </Box>
        </Menu>
      </Box>
    </>
  );
};
