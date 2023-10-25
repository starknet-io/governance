import {
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Icon,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { Button } from "../Button";
import { Text } from "../Text";
import { BellIcon, NotificationUnreadIcon } from "../Icons";
import { NotificationItem } from "./NotificationItem";
import { EmptyState } from "../EmptyState";
import { trpc } from "@yukilabs/governance-frontend/src/utils/trpc";

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

  const filteredNotifications = useMemo(() => {
    return isAllSelected
      ? populatedNotifications
      : populatedNotifications.filter((notification) => !notification.read);
  }, [isAllSelected, populatedNotifications]);

  return (
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
          <MenuList h="500px" overflowY="scroll" w={"400px"}>
            <Box
              mx={4}
              py={4}
              borderBottom="1px solid"
              borderColor="border.dividers"
            >
              <Text variant="bodyLargeStrong"> Notifications </Text>
            </Box>
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
  );
};
