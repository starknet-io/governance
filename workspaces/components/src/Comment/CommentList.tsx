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
  Button as ChakraButton,
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
  TrashIcon,
  WalletIcon,
} from "../Icons/UiIcons";
import { CommentInput } from "./CommentInput";
import { IconButton } from "../IconButton";

import { usePageContext } from "@yukilabs/governance-frontend/src/renderer/PageContextProvider";
import { hasPermission } from "@yukilabs/governance-frontend/src/utils/helpers";
import { ROLES } from "@yukilabs/governance-frontend/src/renderer/types";
import { Button } from "../Button";
import { InfoModal } from "../InfoModal";
import { Banner } from "../Banner/Banner";
import { Tooltip } from "src/Tooltip";

type CommentWithAuthor = Comment & {
  author: User | null;
};

type CommentListProps = {
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
  activeCommentEditor: number | null;
  setActiveCommentEditor: (val: number | null) => void;
};

const CommentItem: React.FC<CommentProps> = ({
  activeCommentEditor,
  setActiveCommentEditor,
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
  const [error, setError] = useState("");
  const canDelete = hasPermission(user?.role, [ROLES.ADMIN, ROLES.MODERATOR]);

  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const isUpvote = votes?.voteType === "upvote";
  const isDownvote = votes?.voteType === "downvote";

  const showReplyMarkdownEditor = activeCommentEditor === comment.id;
  const [isThreadOpen, changeIsThreadOpen] = useState<boolean>(true);
  const hasReplies = comment.replies && comment.replies.length;

  useEffect(() => {
    if (user) {
      setIsConnectedModal(false);
    }
  }, [user]);

  const onSubmit = async (content: string) => {
    const data = {
      parentId: id,
      content: content,
    };
    if (!onReply) {
      setActiveCommentEditor(null);
      return;
    }
    try {
      await onReply(data);
      setActiveCommentEditor(null);
    } catch (err) {
      throw err;
    }
  };

  const numberOfReplies = comment?.replies?.length || 0;
  const [isConnectedModal, setIsConnectedModal] = useState<boolean>(false);
  const [isDeleteModalActive, setIsDeleteModalActive] =
    useState<boolean>(false);
  const { setShowAuthFlow } = useDynamicContext();

  function stripHtmlTagsAndTrim(input: string): string {
    const stripped = input.replace(/[\r\n]+/g, "");

    return stripped.length > 40 ? stripped.substring(0, 40) : stripped;
  }

  const renderAuthorOrAddress = () => {
    const content = (
      <Text as="span" variant="smallStrong" color="content.accent.default">
        {author?.username ||
          author?.ensName ||
          truncateAddress(author ? author.address : "")}
      </Text>
    );

    return !author?.username && !author?.ensName ? (
      <Tooltip label={author ? author.address : ""} aria-label="Address">
        {content}
      </Tooltip>
    ) : (
      content
    );
  };

  return (
    <>
      <InfoModal
        title="Connect wallet to vote"
        isOpen={isConnectedModal}
        onClose={() => setIsConnectedModal(false)}
      >
        <WalletIcon />
        <Button variant="primary" onClick={() => setShowAuthFlow(true)}>
          Connect your wallet
        </Button>
      </InfoModal>
      <InfoModal
        title="Are you sure your want to delete your comment?"
        isOpen={isDeleteModalActive}
        onClose={() => setIsDeleteModalActive(false)}
      >
        <Flex alignItems="center" justifyContent="center">
          <TrashIcon width="104px" height="104px" color="#e4442f" />
        </Flex>
        <Button
          variant="primary"
          onClick={() => {
            if (onDelete) {
              onDelete({ commentId: comment.id });
            }
            setIsDeleteModalActive(false);
          }}
        >
          Delete
        </Button>
      </InfoModal>
      {!comment.isDeleted ? (
        <Stack pl={depth * 8} spacing="0">
          <Flex gap="standard.base" pt="standard.sm">
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
                      ? "40px"
                      : "6px"
                    : "8px"
                }
                width="1px"
                backgroundColor="border.dividers"
                left="50%"
                zIndex="0"
              />
              {author?.profileImage || author?.ensAvatar ? (
                <Avatar
                  size={"md"}
                  src={author?.profileImage || (author?.ensAvatar as string)}
                />
              ) : (
                <Indenticon size={32} address={author?.address || ""} />
              )}
              {hasReplies && numberOfReplies <= 2 && depth < 3 ? (
                <CommentShowMoreReplies
                  nestedReplies={numberOfReplies}
                  toggleReplies={() => changeIsThreadOpen(!isThreadOpen)}
                  isThreadOpen={isThreadOpen}
                />
              ) : null}
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              gap={"standard.xs"}
              w="full"
            >
              <Flex direction="column">
                <Box as="span">{renderAuthorOrAddress()}</Box>
                <Text variant="small" color="content.support.default" mt="-2px">
                  {daysAgo(createdAt)}
                </Text>
              </Flex>
              <Box>
                {isEditMode && showReplyMarkdownEditor ? (
                  <>
                    <CommentInput
                      isEdit
                      withCancel
                      onCancel={() => {
                        setIsEditMode(false);
                        setError("");
                        setActiveCommentEditor(null);
                      }}
                      defaultValue={content}
                      onSend={async (content) => {
                        if (onEdit) {
                          try {
                            await onEdit({ commentId: comment.id, content });
                            setIsEditMode(false);
                            setActiveCommentEditor(null);
                          } catch (err) {
                            setError(err?.message || "");
                          }
                        }
                      }}
                    />
                    {error && error.length && (
                      <Banner type="error" variant="error" label={error} />
                    )}
                  </>
                ) : (
                  <Box>
                    <MarkdownRenderer
                      textProps={{
                        fontSize: "14px",
                        color: "content.accent.default",
                        letterSpacing: "0.07px",
                        marginBottom: "-4px",
                      }}
                      content={content || ""}
                    />
                  </Box>
                )}
              </Box>
              <Flex alignItems="center">
                <Flex alignItems="center" gap={"standard.xs"} height="36px">
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
                      onClick={() => {
                        setActiveCommentEditor(comment.id);
                        setIsEditMode(false);
                      }}
                    >
                      <IconButton
                        variant="ghost"
                        onClick={() => {
                          setIsEditMode(false);
                          setError("");
                          setActiveCommentEditor(comment.id);
                        }}
                        aria-label="Reply"
                        size="condensed"
                        icon={
                          <ReplyIcon
                            width="20px"
                            height="20px"
                            color="#4a4a4f"
                          />
                        }
                      />
                      <Text variant="mediumStrong">Reply</Text>
                    </Flex>
                  )}
                  <Flex alignItems="flex-end">
                    <CommentMoreActions>
                      {canEdit && (
                        <MenuItem
                          onClick={() => {
                            setIsEditMode(true);
                            setError("");
                            setActiveCommentEditor(comment.id);
                          }}
                        >
                          Edit
                        </MenuItem>
                      )}
                      {canDelete && (
                        <MenuItem
                          onClick={() => {
                            setIsDeleteModalActive(true);
                          }}
                        >
                          Delete
                        </MenuItem>
                      )}
                      <ChakraButton
                        variant="ghost"
                        data-tally-open="woRGRN"
                        data-tally-emoji-text="👋"
                        data-tally-emoji-animation="wave"
                        data-comment={comment.id}
                        data-url={
                          typeof window !== "undefined"
                            ? window.location.href
                            : ""
                        }
                        data-user={
                          author?.username || author?.ensName || author?.address
                        }
                        data-content={stripHtmlTagsAndTrim(content)}
                        width={"100%"}
                        justifyContent={"flex-start"}
                        padding={0}
                        minHeight={"33px"}
                        paddingLeft={"10px"}
                        fontWeight={"400"}
                        textColor={"#1a1523"}
                      >
                        Report
                      </ChakraButton>
                    </CommentMoreActions>
                  </Flex>
                </Flex>
              </Flex>
              {showReplyMarkdownEditor && !isEditMode && (
                <form>
                  <CommentInput
                    withCancel
                    onCancel={() => {
                      setError("");
                      setIsEditMode(false);
                      setActiveCommentEditor(null);
                    }}
                    onSend={async (content: string) => {
                      try {
                        await onSubmit(content);
                        setError("");
                        setIsEditMode(false);
                      } catch (err) {
                        setError(err?.message || "");
                      }
                    }}
                  />
                  {error && error.length && (
                    <Banner type="error" variant="error" label={error} />
                  )}
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
      ) : (
        <Box ml={depth * 8 + 4} mt={2} mb={2}>
          <Banner
            variant="commentHidden"
            type="commentHidden"
            label="This comment was deleted by moderator"
          />
        </Box>
      )}
      {comment.replies &&
        isThreadOpen &&
        comment.replies.map((reply: CommentWithAuthor) => (
          <CommentItem
            key={reply.id}
            comment={reply}
            activeCommentEditor={activeCommentEditor}
            setActiveCommentEditor={setActiveCommentEditor}
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
  const [activeCommentEditor, setActiveCommentEditor] = useState<number | null>(
    null,
  );

  return (
    <Flex flexDirection="column">
      {commentsList.map((comment, index) => (
        <CommentItem
          key={index}
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
