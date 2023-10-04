import React, { ReactNode, useEffect, useState } from "react";
import { Comment } from "@yukilabs/governance-backend/src/db/schema/comments";
import { User } from "@yukilabs/governance-backend/src/db/schema/users";
import {
  Avatar,
  Box,
  Flex,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";
import { truncateAddress } from "src/utils";
import { Indenticon } from "../Indenticon";
import { useDynamicContext } from "@dynamic-labs/sdk-react";

import { MarkdownRenderer } from "src/MarkdownRenderer";
import {
  ArrowDownCircleFillIcon,
  ArrowDownCircleIcon,
  ArrowUpCircleFillIcon,
  ArrowUpCircleIcon,
  EllipsisIcon,
  MinusCircleIcon,
  PlusCircleIcon,
  ReplyIcon,
  WalletIcon,
} from "../Icons/UiIcons";
import { CommentInput } from "./CommentInput";
import { IconButton } from "../IconButton";

import { usePageContext } from "@yukilabs/governance-frontend/src/renderer/PageContextProvider";
import { hasPermission } from "@yukilabs/governance-frontend/src/utils/helpers";
import { ROLES } from "@yukilabs/governance-frontend/src/renderer/types";
import { Button } from "../Button";
import { InfoModal } from "../InfoModal";

type CommentWithAuthor = Comment & {
  author: User | null;
};

type CommentListProps = {
  commentsList: CommentWithAuthor[];
};

function daysAgo(date: Date): string {
  const now = new Date();
  const differenceInMs = now.getTime() - date.getTime();
  const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

  if (differenceInDays > 0) {
    return `${differenceInDays}d`;
  } else {
    const differenceInHours = Math.floor(differenceInMs / (1000 * 60 * 60));
    return `${differenceInHours}h`;
  }
}

const CommentShowMoreReplies = ({
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
    mt={3}
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

const CommentVotes = ({
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
  return (
    <Flex direction="row" alignItems="flex-end" gap={2.5}>
      {isUpvote ? (
        <IconButton
          variant="simple"
          onClick={() => {
            if (!isUser && onSignedOutVote) {
              onSignedOutVote();
            } else if (onVote) {
              onVote({ commentId, voteType: "upvote" });
            }
          }}
          aria-label="More comment actions"
          size="small"
          icon={<ArrowUpCircleFillIcon color="#30B37C" boxSize="20px" />}
        />
      ) : (
        <IconButton
          variant="simple"
          onClick={() => {
            if (!isUser && onSignedOutVote) {
              onSignedOutVote();
            } else if (onVote) {
              onVote({ commentId, voteType: "upvote" });
            }
          }}
          aria-label="More comment actions"
          size="small"
          icon={<ArrowUpCircleIcon boxSize="20px" />}
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
      {isDownvote ? (
        <IconButton
          variant="simple"
          onClick={() => {
            if (!isUser && onSignedOutVote) {
              onSignedOutVote();
            } else if (onVote) {
              onVote({ commentId, voteType: "downvote" });
            }
          }}
          aria-label="More comment actions"
          size="small"
          icon={<ArrowDownCircleFillIcon color="#E4442F" boxSize="20px" />}
        />
      ) : (
        <IconButton
          variant="simple"
          onClick={() => {
            if (!isUser && onSignedOutVote) {
              onSignedOutVote();
            } else if (onVote) {
              onVote({ commentId, voteType: "downvote" });
            }
          }}
          aria-label="More comment actions"
          size="small"
          icon={<ArrowDownCircleIcon boxSize="20px" />}
        />
      )}
    </Flex>
  );
};

const CommentMoreActions = ({ children }: { children: ReactNode }) => (
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

type CommentProps = {
  comment: CommentWithAuthor;
  onReply?: (data: { parentId: number; content: string }) => void;
  onEdit?: (data: { commentId: number; content: string }) => void;
  onDelete?: (data: { commentId: number }) => void;
  onVote?: (data: {
    commentId: number;
    voteType: "upvote" | "downvote";
  }) => void;
  depth?: number;
};

const CommentItem: React.FC<CommentProps> = ({
  comment,
  onReply,
  onVote,
  onEdit,
  onDelete,
  depth = 0,
}) => {
  const { author, createdAt, content, id, votes } = comment;
  const { user } = usePageContext();
  const canEdit = comment.userId === user?.id;
  const canDelete = hasPermission(user?.role, [ROLES.ADMIN, ROLES.MODERATOR]);

  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const isUpvote = votes?.voteType === "upvote";
  const isDownvote = votes?.voteType === "downvote";

  const [showReplyMarkdownEditor, setShowReplyMarkdownEditor] =
    useState<boolean>(false);
  const [isThreadOpen, changeIsThreadOpen] = useState<boolean>(true);
  const hasReplies = comment.replies && comment.replies.length;

  useEffect(() => {
    if (user) {
      setIsConnectedModal(false);
    }
  }, [user]);

  const onSubmit = (content: string) => {
    const data = {
      parentId: id,
      content: content,
    };
    if (onReply) {
      onReply(data);
      setShowReplyMarkdownEditor(false);
    }
  };

  const numberOfReplies = comment?.replies?.length || 0;
  const [isConnectedModal, setIsConnectedModal] = useState<boolean>(false);
  const { setShowAuthFlow } = useDynamicContext();

  return (
    <>
      <InfoModal
        title="Connect wallet to vote for comment"
        isOpen={isConnectedModal}
        onClose={() => setIsConnectedModal(false)}
      >
        <WalletIcon />
        <Button variant="primary" onClick={() => setShowAuthFlow(true)}>
          Connect your wallet
        </Button>
      </InfoModal>
      <Stack pl={depth * 8}>
        <Flex gap={3}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
            minWidth="40px"
            position="relative"
          >
            <Box
              position="absolute"
              top="48px"
              bottom={
                hasReplies && depth < 3
                  ? numberOfReplies < 3
                    ? "26px"
                    : "8px"
                  : "-10px"
              }
              width="1px"
              backgroundColor="#DCDBDD"
              left="50%"
              zIndex="0"
            />
            {author?.profileImage || author?.ensAvatar ? (
              <Avatar
                size={"sm"}
                src={author?.profileImage || (author?.ensAvatar as string)}
              />
            ) : (
              <Indenticon size={40} address={author?.address || ""} />
            )}
            {hasReplies && numberOfReplies <= 2 && depth < 3 ? (
              <CommentShowMoreReplies
                nestedReplies={numberOfReplies}
                toggleReplies={() => changeIsThreadOpen(!isThreadOpen)}
                isThreadOpen={isThreadOpen}
              />
            ) : null}
          </Box>
          <Box display="flex" flexDirection="column" gap={3} w="full">
            <Flex direction="column">
              <Text fontWeight="bold" fontSize="12px">
                {author?.username ||
                  author?.ensName ||
                  truncateAddress(author ? author.address : "")}
              </Text>
              <Text fontSize="12px" color="#6C6C75">
                {daysAgo(createdAt)}
              </Text>
            </Flex>
            <Box>
              {isEditMode ? (
                <CommentInput
                  withCancel
                  onCancel={() => setIsEditMode(false)}
                  defaultValue={content}
                  onSend={(content) => {
                    if (onEdit) {
                      onEdit({ commentId: comment.id, content });
                    }
                    setIsEditMode(false);
                  }}
                />
              ) : (
                <MarkdownRenderer content={content || ""} />
              )}
            </Box>
            <Flex alignItems="center">
              <Flex gap={5}>
                <CommentVotes
                  isUser={!!user}
                  isDownvote={isDownvote}
                  isUpvote={isUpvote}
                  commentId={comment.id}
                  onVote={onVote}
                  onSignedOutVote={() => setIsConnectedModal(true)}
                  netVotes={comment.netVotes}
                />
                {user && (
                  <Flex
                    alignItems="center"
                    role="button"
                    gap={1}
                    onClick={() =>
                      setShowReplyMarkdownEditor(!showReplyMarkdownEditor)
                    }
                  >
                    <IconButton
                      variant="simple"
                      onClick={() => {
                        setShowReplyMarkdownEditor(!showReplyMarkdownEditor);
                      }}
                      aria-label="Reply"
                      size="small"
                      icon={<ReplyIcon width="20px" height="20px" />}
                    />
                    <Text variant="mediumStrong">Reply</Text>
                  </Flex>
                )}
                <Flex alignItems="flex-end">
                  <CommentMoreActions>
                    {canEdit && (
                      <MenuItem onClick={() => setIsEditMode(true)}>
                        Edit
                      </MenuItem>
                    )}
                    {canDelete && (
                      <MenuItem
                        onClick={() => {
                          if (onDelete) {
                            onDelete({ commentId: comment.id });
                          }
                        }}
                      >
                        Delete
                      </MenuItem>
                    )}
                    <MenuItem>Report</MenuItem>
                  </CommentMoreActions>
                </Flex>
              </Flex>
            </Flex>
            {showReplyMarkdownEditor && (
              <form>
                <CommentInput
                  withCancel
                  onCancel={() => setShowReplyMarkdownEditor(false)}
                  onSend={(content: string) => {
                    onSubmit(content);
                  }}
                />
              </form>
            )}
            {numberOfReplies > 2 && depth < 3 && (
              <CommentShowMoreReplies
                nestedReplies={numberOfReplies}
                toggleReplies={() => changeIsThreadOpen(!isThreadOpen)}
                isThreadOpen={isThreadOpen}
              />
            )}
          </Box>
        </Flex>
      </Stack>
      {comment.replies &&
        isThreadOpen &&
        comment.replies.map((reply: CommentWithAuthor) => (
          <CommentItem
            key={reply.id}
            comment={reply}
            onReply={onReply}
            onVote={onVote}
            onDelete={onDelete}
            onEdit={onEdit}
            depth={depth < 3 ? depth + 1 : depth}
          />
        ))}
    </>
  );
};

export const CommentList: React.FC<CommentListProps> = ({
  commentsList,
  onReply,
  onVote,
  onEdit,
  onDelete,
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
  return (
    <Flex flexDirection="column" gap="20px">
      {commentsList.map((comment, index) => (
        <CommentItem
          key={index}
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
