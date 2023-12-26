import React, { ReactNode, useState } from "react";
import { Comment } from "@yukilabs/governance-backend/src/db/schema/comments";
import { User } from "@yukilabs/governance-backend/src/db/schema/users";
import { Box, Flex, Menu, MenuButton, MenuList, Text } from "@chakra-ui/react";

import {
  ArrowDownCircleFillIcon,
  ArrowDownCircleIcon,
  ArrowUpCircleFillIcon,
  ArrowUpCircleIcon,
  EllipsisIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from "../Icons/UiIcons";
import { IconButton } from "../IconButton";
import CommentItem from "./CommentItem";
import { Button } from "../Button";

export type CommentWithAuthor = Comment & {
  author: User | null;
};

export type CommentListProps = {
  commentsList: CommentWithAuthor[];
};

const hoverStyles = {
  position: "relative",
  "::before": {
    content: '""',
    display: "block",
    position: "absolute",
    width: "32px",
    height: "32px",
    borderRadius: "50%", // to make it a circle
    backgroundColor: "#37163708",
    zIndex: 0,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
};
const focusStyles = {
  ...hoverStyles, // Using the same style for hover and focus
  "::before": {
    ...hoverStyles["::before"],
    backgroundColor: "#2B1E3714",
    // Any additional styles for focus state can be added here
  },
};

export function daysAgo(date: Date): string {
  const now = new Date();
  const differenceInMs = now.getTime() - date.getTime();

  const minutes = Math.floor(differenceInMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30); // assuming average month duration
  const years = Math.floor(days / 365); // assuming non-leap year for simplicity

  if (years > 0) {
    return `${years}y`;
  } else if (months > 0) {
    return `${months}m`;
  } else if (weeks > 0) {
    return `${weeks}w`;
  } else if (days > 0) {
    return `${days}d`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return "0m";
  }
}

export const FetchMoreRepliesButton = ({
  onFetchMoreReplies,
  remainingReplies,
}: any) => (
  <Button mt={2} variant="ghost" onClick={onFetchMoreReplies} maxW="160px">
    Fetch {remainingReplies} more replies
  </Button>
);

export const CommentShowMoreReplies = ({
  isThreadOpen,
  toggleReplies,
  nestedReplies = 3,
}: {
  isThreadOpen: boolean;
  toggleReplies: () => void;
  nestedReplies: number;
}) => (
  <Flex
    alignItems="center"
    role="button"
    gap={1}
    onClick={toggleReplies}
    mt={0}
    height="36px"
  >
    {isThreadOpen ? (
      <MinusCircleIcon boxSize="22px" />
    ) : (
      <PlusCircleIcon boxSize="22px" />
    )}
    {nestedReplies > 2 && (
      <Text variant="mediumStrong">
        Show {isThreadOpen ? "less" : `${nestedReplies} more`} replies
      </Text>
    )}
  </Flex>
);

export const CommentVotes = ({
  onVote,
  netVotes,
  isUpvote,
  isDownvote,
  onSignedOutVote,
  isUser,
  commentId,
}: {
  onVote?: (data: {
    commentId: number;
    voteType: "upvote" | "downvote";
  }) => void;
  netVotes: number | null;
  isUpvote: boolean;
  isUser?: boolean;
  onSignedOutVote?: () => void;
  isDownvote: boolean;
  commentId: number;
}) => {
  const [isUpvoteHovered, setUpvoteIsHovered] = useState(false);
  const [isDownvoteHovered, setDownvoteIsHovered] = useState(false);
  const [isUpvoteFocused, setUpvoteIsFocused] = useState(false);
  const [isDownvoteFocused, setDownvoteIsFocused] = useState(false);

  return (
    <Flex direction="row" alignItems="flex-end" gap={2.5}>
      {isUpvote || isUpvoteHovered || isUpvoteFocused ? (
        <IconButton
          variant="simple"
          _hover={hoverStyles}
          onMouseLeave={() => setUpvoteIsHovered(false)}
          _focus={{ ...focusStyles }}
          size="small"
          onFocus={() => setUpvoteIsFocused(true)}
          onBlur={() => setUpvoteIsFocused(false)}
          onClick={() => {
            if (!isUser && onSignedOutVote) {
              onSignedOutVote();
            } else if (onVote) {
              onVote({ commentId, voteType: "upvote" });
            }
          }}
          aria-label="Upvote comment"
          icon={
            <ArrowUpCircleFillIcon
              zIndex={1}
              color={isUpvoteFocused ? "#216348" : "#30B37C"}
              boxSize="20px"
            />
          }
        />
      ) : (
        <IconButton
          variant="simple"
          _hover={hoverStyles}
          size="small"
          _focus={focusStyles}
          onMouseEnter={() => setUpvoteIsHovered(true)}
          onMouseLeave={() => setUpvoteIsHovered(false)}
          onFocus={() => setUpvoteIsFocused(true)}
          onBlur={() => setUpvoteIsFocused(false)}
          onClick={() => {
            if (!isUser && onSignedOutVote) {
              onSignedOutVote();
            } else if (onVote) {
              onVote({ commentId, voteType: "upvote" });
            }
          }}
          aria-label="Upvote comment"
          icon={<ArrowUpCircleIcon zIndex={1} boxSize="20px" />}
        />
      )}

      <Text
        variant="mediumStrong"
        style={{
          color: isUpvote ? "#30B37C" : isDownvote ? "#E4442F" : "#4A4A4F",
        }}
      >
        {netVotes}
      </Text>
      {isDownvote || isDownvoteHovered || isDownvoteFocused ? (
        <IconButton
          _hover={hoverStyles}
          _focus={{ ...focusStyles }}
          size="small"
          variant="simple"
          onFocus={() => setDownvoteIsFocused(true)}
          onBlur={() => setDownvoteIsFocused(false)}
          onMouseLeave={() => setDownvoteIsHovered(false)}
          onClick={() => {
            if (!isUser && onSignedOutVote) {
              onSignedOutVote();
            } else if (onVote) {
              onVote({ commentId, voteType: "downvote" });
            }
          }}
          aria-label="Downvote comment"
          icon={
            <ArrowDownCircleFillIcon
              zIndex={1}
              color={isDownvoteFocused ? "#C42D1A" : "#E4442F"}
              boxSize="20px"
            />
          }
        />
      ) : (
        <IconButton
          variant="simple"
          _hover={hoverStyles}
          _focus={focusStyles}
          size="small"
          onClick={() => {
            if (!isUser && onSignedOutVote) {
              onSignedOutVote();
            } else if (onVote) {
              onVote({ commentId, voteType: "downvote" });
            }
          }}
          aria-label="Downvote comment"
          onMouseEnter={() => setDownvoteIsHovered(true)}
          onMouseLeave={() => setDownvoteIsHovered(false)}
          onFocus={() => setDownvoteIsFocused(true)}
          onBlur={() => setDownvoteIsFocused(false)}
          //... other props and handlers
          icon={<ArrowDownCircleIcon zIndex={1} boxSize="20px" />}
        />
      )}
    </Flex>
  );
};

export const CommentMoreActions = ({ children }: { children: ReactNode }) => (
  <Box style={{ position: "relative" }}>
    <Menu>
      <MenuButton
        as={IconButton}
        size="small"
        icon={<EllipsisIcon boxSize="20px" />}
        variant="icon"
      />

      <Box top="0px" position="relative">
        <MenuList>{children}</MenuList>
      </Box>
    </Menu>
  </Box>
);

export type CommentProps = {
  comment: CommentWithAuthor;
  onReply?: (data: { parentId: number; content: string }) => void;
  onEdit?: (data: { commentId: number; content: string }) => void;
  onDelete?: (data: { commentId: number }) => void;
  onVote?: (data: {
    commentId: number;
    voteType: "upvote" | "downvote";
  }) => void;
  depth?: number;
  activeCommentEditor: number | null;
  setActiveCommentEditor: (val: number | null) => void;
  fetchMoreReplies: (commentId: number, repliesCount: number) => void;
};

export const CommentList: React.FC<CommentListProps> = ({
  commentsList,
  onReply,
  onVote,
  onEdit,
  onDelete,
  fetchMoreReplies,
}: {
  commentsList: CommentWithAuthor[];
  onReply?: (data: { parentId: number; content: string }) => void;
  onVote?: (data: {
    commentId: number;
    voteType: "upvote" | "downvote";
  }) => void;
  onEdit?: (data: { commentId: number; content: string }) => void;
  onDelete?: (data: { commentId: number }) => void;
}) => {
  const [activeCommentEditor, setActiveCommentEditor] = useState<number | null>(
    null,
  );

  return (
    <Flex flexDirection="column">
      {commentsList.map((comment, index) => (
        <CommentItem
          key={index}
          onFetchMoreReplies={fetchMoreReplies}
          activeCommentEditor={activeCommentEditor}
          setActiveCommentEditor={setActiveCommentEditor}
          comment={comment}
          onReply={onReply}
          onVote={onVote}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </Flex>
  );
};
