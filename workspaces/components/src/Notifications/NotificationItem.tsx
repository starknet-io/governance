import { truncateAddress } from "../utils";
import {
  MenuItem,
  Text,
  VoteAbstainIcon,
  VoteAgainstIcon,
  VoteForIcon,
} from "../../index";
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
    postId: string | number;
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

const findIndexOfLargest = (scores: Array<number>) => {
  let maxIndex = 0; // Start with the first index
  if (!scores || !scores.length || !scores.length === 3) {
    return 0;
  }
  let maxValue = scores[0]; // And the first value

  for (let i = 1; i < scores.length; i++) {
    if (scores[i] > maxValue) {
      maxIndex = i;
      maxValue = scores[i];
    }
  }

  return maxIndex; // Return the index of the largest number
};

export const NotificationItem = ({
  notification,
  onMarkNotificationRead,
}: NotificationItemProps) => {
  const formattedAddress =
    notification?.user?.username ||
    notification?.user?.ensName ||
    truncateAddress(notification?.user?.address);
  const isProposal = notification.type.includes("proposal");
  const isPost = notification.postId;
  const isComment = notification.type.includes("comment");
  const isProposalCreate = notification.type === "proposal/created";
  const isProposalStart = notification.type === "proposal/start";
  const isProposalEnd = notification.type === "proposal/end";
  const getProposalResultAsIcon = () => {
    const { proposal } = notification;
    if (!proposal) {
      return "";
    }
    const result = findIndexOfLargest(proposal.scores);
    if (result === 0) {
      return <VoteForIcon color="#44D095" boxSize="20px" />;
    }
    if (result === 1) {
      return <VoteAgainstIcon color="#EC796B" boxSize="20px" />;
    }
    if (result === 2) {
      return <VoteAbstainIcon color="#4A4A4F" boxSize="20px" />;
    }
    return <VoteForIcon color="#44D095" boxSize="20px" />;
  };
  const formattedType = () => {
    if (isComment) {
      return `replied on your comment on ${isPost ? "post" : "proposal"}:`;
    } else if (isProposalStart) {
      return "Voting is active on proposal:";
    } else if (isProposalCreate) {
      return "added a new proposal:";
    } else if (isProposalEnd) {
      return "Voting has ended with majority vote of";
    }

    return notification.type;
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
  const notProposalStartOrEnd = !isProposalEnd && !isProposalStart;
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
        <Flex
          direction="column"
          alignItems="center"
          gap={notProposalStartOrEnd ? 1 : 0}
        >
          {notProposalStartOrEnd ? (
            <>
              {avatar ? (
                <Avatar width={8} height={8} src={avatar} />
              ) : (
                <Indenticon
                  size={32}
                  address={notification?.user?.address?.toLowerCase()}
                />
              )}
            </>
          ) : (
            <Box width={8}></Box>
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
          <Box ml={1}>
            {!isProposalStart && !isProposalEnd ? (
              <>
                <Text as="span" variant="bodyMediumStrong">
                  {formattedAddress}
                </Text>{" "}
                {/* This space is important to separate inline elements */}
              </>
            ) : null}
            <Text
              as="span"
              variant="mediumStrong"
              color="content.support.default"
            >
              {formattedType()}
            </Text>{" "}
            {isProposalEnd && (
              <>
                <Icon as={() => getProposalResultAsIcon()} />{" "}
                <Text
                  as="span"
                  variant="mediumStrong"
                  color="content.support.default"
                >
                  on proposal:
                </Text>{" "}
              </>
            )}
            {/* This space is important to separate inline elements */}
            <Text
              as="span"
              variant="mediumStrong"
              color="content.default.default"
            >
              “{getTitle()}“
            </Text>
          </Box>
          <Text variant="small" color="content.support.default" ml={1}>
            {daysAgo(notification.createdAt)} ago
          </Text>
        </Flex>
        <Flex alignSelf="center" justifySelf="flex-end">
          {!notification.read ? <Icon as={NotificationUnreadIcon} /> : null}
        </Flex>
      </Flex>
    </MenuItem>
  );
};
