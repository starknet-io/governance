import { truncateAddress } from "../utils";
import { MenuItem, Text } from "../../index";
import { Flex, Icon, Box } from "@chakra-ui/react";
import { Indenticon } from "../Indenticon";
import {
  NotificationUnreadIcon,
  NotificationVotingProposalIcon,
} from "../Icons";
import { daysAgo } from "../Comment/CommentList";
import { navigate } from "vite-plugin-ssr/client/router";

type NotificationItemProps = {
  notification: {
    id: string;
    user: {
      address: string;
      ensName: string;
    };
    type: string;
    title: string;
    createdAt: Date;
    time: Date;
    read: boolean;
    proposalId: string;
  };
  onMarkNotificationRead: (notificationId: string) => void;
};

export const NotificationItem = ({
  notification,
  onMarkNotificationRead,
}: NotificationItemProps) => {
  const formattedAddress =
    notification?.user?.ensName || truncateAddress(notification?.user?.address);
  return (
    <MenuItem
      maxW={"400px"}
      pt={2}
      pb={1}
      key={notification.id}
      onClick={() => {
        if (notification.proposalId) {
          onMarkNotificationRead(notification.id);
          navigate(`/voting-proposals/${notification.proposalId}`);
        }
      }}
    >
      <Flex gap={1.5} width="100%">
        <Flex direction="column" alignItems="center" gap={1}>
          <Indenticon size={32} address={notification?.user?.address} />
          <Icon as={NotificationVotingProposalIcon} boxSize="5" />
        </Flex>
        <Flex direction="column" alignItems="flex-start" flex="1">
          <Box display="inline-block">
            <Text ml={1} variant="bodyMediumStrong" display="inline-block">
              {formattedAddress}
            </Text>
            <Text
              ml={1}
              variant="mediumStrong"
              color="content.support.default"
              display="inline-block"
            >
              {notification.type}:
            </Text>
            <Text ml={1} variant="mediumStrong" color="content.default.default">
              “{notification.title}“
            </Text>
          </Box>
          <Text variant="small" color="content.support.default" ml={1}>
            {daysAgo(notification.createdAt)}
          </Text>
        </Flex>
        <Flex alignSelf="center" justifySelf="flex-end">
          {!notification.read ? <Icon as={NotificationUnreadIcon} /> : null}
        </Flex>
      </Flex>
    </MenuItem>
  );
};
