import React, { useEffect, useState } from "react";
import { usePageContext } from "@yukilabs/governance-frontend/src/renderer/PageContextProvider";
import { hasPermission } from "@yukilabs/governance-frontend/src/utils/helpers";
import { ROLES } from "@yukilabs/governance-frontend/src/renderer/types";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Avatar, Box, Flex, MenuItem, Stack, Text } from "@chakra-ui/react";
import { truncateAddress } from "../utils";
import { Tooltip } from "../Tooltip";
import { InfoModal } from "../InfoModal";
import { TrashIcon, WalletIcon } from "../Icons";
import { Button } from "../Button";
import { Indenticon } from "../Indenticon";
import { CommentInput } from "./CommentInput";
import { Banner } from "../Banner/Banner";
import { MarkdownRenderer } from "../MarkdownRenderer";
import { IconButton } from "../IconButton";
import { ReplyIcon } from "../Icons/UiIcons";
import { Button as ChakraButton } from "@chakra-ui/react";
import {
  CommentMoreActions,
  CommentProps,
  CommentShowMoreReplies,
  CommentVotes,
  CommentWithAuthor,
  daysAgo,
  FetchMoreRepliesButton,
} from "./CommentList";

const CommentItem: React.FC<CommentProps> = ({
  activeCommentEditor,
  setActiveCommentEditor,
  comment,
  onReply,
  onVote,
  onEdit,
  onDelete,
  fetchMoreReplies,
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
      <Flex direction="row" gap="standard.base" alignItems="center">
        <Text as="span" variant="smallStrong" color="content.accent.default">
          {author?.username ||
            author?.ensName ||
            truncateAddress(author ? author.address?.toLowerCase() : "")}
        </Text>
        <Text as="span" variant="bodySmall" color="content.accent.default">{`•`}</Text>
        <Text
          as="span"
          variant="smallStrong"
          color="content.accent.default"
          borderRadius="standard.base"
          background="#E2E2E2"
          padding="standard.base"
        >
          {truncateAddress(author ? author.address?.toLowerCase() : "", 4, 2)}
        </Text>
      </Flex>
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
        <Stack pl={depth * 8} spacing="0" position="relative" overflow="hidden">
          <Box
            position="absolute"
            top="0px"
            bottom="-35px"
            width="1px"
            backgroundColor="border.dividers"
            left={`calc(4rem - 44px)`}
            zIndex="0"
          />
          {depth > 1 && (
            <Box
              position="absolute"
              top="0"
              bottom="-35px"
              width="1px"
              backgroundColor="border.dividers"
              left={`calc(6rem - 44px)`}
              zIndex="0"
            />
          )}
          {depth === 3 && (
            <Box
              position="absolute"
              top="0"
              bottom="-35px"
              width="1px"
              backgroundColor="border.dividers"
              left={`calc(8rem - 44px)`}
              zIndex="0"
            />
          )}
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
                top="52px"
                bottom={
                  hasReplies && depth < 3
                    ? numberOfReplies < 3
                      ? "40px"
                      : "6px"
                    : "0"
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
                  sx={{
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      width: "32px",
                      height: "54px",
                      backgroundColor: "white",
                      top: "-12px",
                      left: "0",
                      zIndex: 2
                    }
                  }}
                />
              ) : (
                <Indenticon size={32} address={author?.address || ""} sx={{
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    width: "32px",
                    height: "54px",
                    backgroundColor: "white",
                    top: "-12px",
                    left: "0",
                    zIndex: 2
                  }
                }}/>
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
                      className="markdown-body-comments"
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
                <Flex alignItems="center" height="36px">
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
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsEditMode(false);
                        setError("");
                        setActiveCommentEditor(comment.id);
                      }}
                      aria-label="Reply"
                      size="condensed"
                      sx={{
                        gap: "standard.xs",
                        marginLeft: "standard.xs"
                      }}
                    >
                      <ReplyIcon
                        width="20px"
                        height="20px"
                        color="#4a4a4f"
                      />
                      Reply
                    </Button>
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
            fetchMoreReplies={fetchMoreReplies}
          />
        ))}
      {comment.remainingReplies > 0 && isThreadOpen && (
        <Stack pl={(depth + 0.5) * 8}>
          <FetchMoreRepliesButton
            fetchMoreReplies={() => {
              fetchMoreReplies(comment.id, comment.replies.length);
            }}
            remainingReplies={comment.remainingReplies}
          />
        </Stack>
      )}
    </>
  );
};

export default CommentItem;
