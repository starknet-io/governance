import { truncateAddress } from "../utils";
import { MenuItem, Text } from "../../index";
import { Flex, Icon, Box, Avatar } from "@chakra-ui/react";
import { Indenticon } from "../Indenticon";
import {
  NotificationUnreadIcon,
  NotificationVotingProposalIcon,
  CommentIcon,
} from "../Icons";
import { daysAgo } from "../Comment/CommentList";
import { navigate } from "vite-plugin-ssr/client/router";

type NotificationItemProps = {
  notification: {
    id: string;
    post?: any;
    proposal?: any;
    user: {
      address: string;
      ensName: string;
      profileImage?: string;
      ensAvatar?: string;
      username?: string;
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
    notification?.user?.username || notification?.user?.ensName || truncateAddress(notification?.user?.address);
  const isProposal = notification.type.includes("proposal");
  const isComment = notification.type.includes("comment");
  const formattedType = () => {
    return isComment ? "replied on your comment" : notification.type;
  };
  const avatar =
    notification?.user?.profileImage || notification?.user?.ensAvatar;
  const getTitle = () => {
    return (
      notification?.post?.title ||
      notification?.proposal?.title ||
      notification.title
    );
  };
  return (
    <MenuItem
      maxW={"400px"}
      pt={2}
      pb={1}
      key={notification.id}
      onClick={() => {
        onMarkNotificationRead(notification.id);
        if (notification.proposalId) {
          navigate(`/voting-proposals/${notification.proposalId}`);
        } else if (notification.post && notification.post.council) {
          navigate(
            `/councils/${notification.post.council.slug}/posts/${notification.post.slug}`,
          );
        }
      }}
    >
      <Flex gap={1.5} width="100%">
        <Flex direction="column" alignItems="center" gap={1}>
          {avatar ? (
            <Avatar width={8} height={8} src={avatar} />
          ) : (
            <Indenticon size={32} address={notification?.user?.address?.toLowerCase()} />
          )}
          <Box color="content.support.default">
            <Icon
              as={() =>
                isProposal ? (
                  <NotificationVotingProposalIcon boxSize="20px" />
                ) : (
                  <CommentIcon color="currentColor" boxSize="20px" />
                )
              }
            />
          </Box>
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
              {formattedType()}:
            </Text>
            <Text ml={1} variant="mediumStrong" color="content.default.default">
              “{getTitle()}“
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
