import React, { useEffect, useState } from "react";
import { trpc } from "../../../utils/trpc";
import {
  AppBar,
  Banner,
  Box,
  Button,
  CommentInput,
  CommentList,
  EmptyState,
  FormControl,
  Heading,
  Text,
} from "@yukilabs/governance-components";
import { Divider, HStack, Select } from "@chakra-ui/react";
import * as VoteLayout from "../VotingProposal/PageLayout";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useHelpMessage } from "../../../hooks/HelpMessage";

const LIMIT = 5;

const sortByOptions = {
  defaultValue: "date",
  options: [
    { label: "Date", value: "date" },
    { label: "Upvotes", value: "upvotes" },
  ],
};

const VotingProposalComments = ({
  proposalId,
  proposalState,
}: {
  proposalId: string;
  proposalState?: string;
}) => {
  const [offset, setOffset] = useState(1);
  const [allComments, setAllComments] = useState([]);
  const [sortBy, setSortBy] = useState<"date" | "upvotes">("date");
  const [helpMessage, setHelpMessage] = useHelpMessage();
  const [newComment, setNewComment] = useState<any>(null);

  const { user } = useDynamicContext();

  const comments = trpc.comments.getProposalComments.useQuery({
    offset,
    limit: LIMIT,
    sort: sortBy,
    proposalId,
  });

  const onLoadMoreComments = () => {
    setOffset(offset + 1);
  };

  const [fetchParams, setFetchParams] = useState({
    commentId: null,
    offset: 0,
  });

  const fetchReplies = trpc.comments.getReplies.useQuery(
    {
      commentId: fetchParams.commentId,
      limit: 5,
      offset: fetchParams.offset,
    },
    {
      enabled: false,
    },
  );

  const fetchMoreReplies = (
    commentId: number | null,
    currentRepliesCount: number,
  ) => {
    setFetchParams({ commentId, offset: currentRepliesCount });
  };

  useEffect(() => {
    if (fetchReplies.data) {
      // Update your comments state with the new replies
      setAllComments((prevComments) =>
        updateCommentsWithNewReplies(
          prevComments,
          fetchParams.commentId,
          fetchReplies.data.replies,
        ),
      );
    }
  }, [fetchReplies.data, fetchParams.commentId]);

  useEffect(() => {
    if (fetchParams.commentId !== null) {
      fetchReplies.refetch();
    }
  }, [fetchParams.commentId, fetchParams.offset]);

  const saveComment = trpc.comments.saveComment.useMutation({
    onSuccess: () => {
      // comments.refetch();
    },
  });

  const editComment = trpc.comments.editComment.useMutation({
    onSuccess: () => {
      // comments.refetch();
    },
  });

  const deleteComment = trpc.comments.deleteComment.useMutation({
    onSuccess: () => {
      // comments.refetch();
    },
  });

  const voteComment = trpc.comments.voteComment.useMutation({
    onSuccess: () => {
      // comments.refetch();
    },
  });

  useEffect(() => {
    if (newComment) {
      if (newComment?.parentId) {
        setAllComments((prevComments) =>
          addNewReplyToComments(prevComments, newComment),
        );
      } else {
        setAllComments((prevComments) =>
          addNewCommentToComments(prevComments, newComment),
        );
      }
      setNewComment(null);
    }
  }, [newComment]);

  const addNewCommentToComments = (comments, newComment) => {
    // Add new top-level comment
    return [newComment, ...comments];
  };

  const addNewReplyToComments = (comments, newComment) => {
    // Add new reply to an existing comment
    const toIterate = Array.isArray(comments) ? comments : comments.replies;
    return toIterate.map((comment) => {
      if (comment.id === newComment.parentId) {
        return {
          ...comment,
          replies: comment.replies
            ? [...comment.replies, newComment]
            : [newComment],
        };
      } else if (comment.replies) {
        return {
          ...comment,
          replies: addNewReplyToComments(comment.replies, newComment),
        };
      }
      return comment;
    });
  };

  const updateEditedComment = (commentId, newContent) => {
    setAllComments((prevComments) =>
      updateCommentInList(prevComments, commentId, (comment) => ({
        ...comment,
        content: newContent,
      })),
    );
  };

  const markCommentAsDeleted = (commentId) => {
    setAllComments((prevComments) =>
      updateCommentInList(prevComments, commentId, (comment) => ({
        ...comment,
        isDeleted: true,
      })),
    );
  };

  const updateCommentInList = (comments, commentId, updateFunction) => {
    return comments.map((comment) => {
      if (comment.id === commentId) {
        return updateFunction(comment);
      } else if (comment.replies) {
        return {
          ...comment,
          replies: updateCommentInList(
            comment.replies,
            commentId,
            updateFunction,
          ),
        };
      }
      return comment;
    });
  };

  const handleCommentSend = async (value: string) => {
    try {
      const newComment = await saveComment.mutateAsync({
        content: value,
        proposalId: proposalId,
      });
      setNewComment(newComment);
    } catch (error) {
      // Handle error
      throw error;
    }
  };

  const handleCommentEdit = async ({
    content,
    commentId,
  }: {
    content: string;
    commentId: number;
  }) => {
    try {
      await editComment.mutateAsync({
        content,
        id: commentId,
      });
      updateEditedComment(commentId, content);
    } catch (error) {
      // Handle error
      throw error;
    }
  };

  const handleCommentDelete = async ({ commentId }: { commentId: number }) => {
    try {
      await deleteComment.mutateAsync({
        id: commentId,
      });
      markCommentAsDeleted(commentId);
    } catch (error) {
      // Handle error
      console.log(error);
    }
  };

  const handleReplySend = async ({
    content,
    parentId,
  }: {
    content: string;
    parentId: number;
  }) => {
    try {
      const newComment = await saveComment.mutateAsync({
        content,
        parentId,
        proposalId: proposalId,
      });
      setNewComment(newComment);
    } catch (error) {
      // Handle error
      throw error;
    }
  };

  const updateCommentVotes = (
    commentId: number,
    newVoteType: "upvote" | "downvote",
  ) => {
    setAllComments((prevComments: any) =>
      prevComments.map((comment: any) => {
        // Function to update vote counts
        const updateVotes = (comment) => {
          let updatedComment = { ...comment };
          let isNewVote = false;

          if (!updatedComment.votes) {
            updatedComment.votes = { voteType: newVoteType };
            isNewVote = true;
          }

          if (newVoteType === "upvote") {
            if (isNewVote || updatedComment.votes.voteType !== "upvote") {
              updatedComment.upvotes += 1;
            }
            if (updatedComment.votes.voteType === "downvote") {
              updatedComment.downvotes -= 1;
            }
          } else if (newVoteType === "downvote") {
            if (isNewVote || updatedComment.votes.voteType !== "downvote") {
              updatedComment.downvotes += 1;
            }
            if (updatedComment.votes.voteType === "upvote") {
              updatedComment.upvotes -= 1;
            }
          }

          updatedComment.netVotes =
            updatedComment.upvotes - updatedComment.downvotes;
          updatedComment.votes.voteType = newVoteType;

          return updatedComment;
        };

        if (comment.id === commentId) {
          return updateVotes(comment);
        } else if (comment.replies) {
          const updatedReplies = comment.replies.map((reply) =>
            reply.id === commentId ? updateVotes(reply) : reply,
          );
          return { ...comment, replies: updatedReplies };
        }
        return comment;
      }),
    );
  };

  const handleCommentVote = async ({ commentId, voteType }) => {
    try {
      await voteComment.mutateAsync({
        commentId,
        voteType,
      });
      updateCommentVotes(commentId, voteType);
    } catch (error) {
      console.log(error);
    }
  };

  const commentCount = comments?.data?.comments?.length || 0;
  const [commentError, setCommentError] = useState("");

  const updateCommentsWithNewReplies = (comments, commentId, newReplies) => {
    return comments.map((comment) => {
      if (comment.id === commentId) {
        // Found the comment, now update its replies
        return {
          ...comment,
          replies: [...comment.replies, ...newReplies],
          remainingReplies: comment.remainingReplies - newReplies.length,
        };
      } else if (comment.replies && comment.replies.length > 0) {
        // Recursively update nested comments
        return {
          ...comment,
          replies: updateCommentsWithNewReplies(
            comment.replies,
            commentId,
            newReplies,
          ),
        };
      }
      // Return the comment unchanged if it's not the one we're updating
      return comment;
    });
  };

  useEffect(() => {
    if (sortBy && sortBy.length) {
      setAllComments([])
      setOffset(1)
    }
  }, [sortBy]);

  useEffect(() => {
    if (comments.data && comments.data?.comments && !comments.isLoading) {
      setAllComments((prevComments) => {
        const newComments = comments.data.comments.filter(
          (comment) => !prevComments.some((prev) => prev.id === comment.id)
        );
        return [...prevComments, ...newComments];
      });
    }
  }, [comments.data, comments.isLoading]);

  return (
    <VoteLayout.Discussion>
      <Heading
        color="content.accent.default"
        variant="h3"
        mb="standard.2xl"
        id="discussion"
      >
        Discussion
      </Heading>
      {(proposalState === "active" || proposalState === "pending") && user ? (
        <FormControl id="delegate-statement">
          <CommentInput
            onSend={async (comment) => {
              try {
                await handleCommentSend(comment);
                setCommentError("");
              } catch (err) {
                setCommentError(err?.message || "");
              }
            }}
          />
          {commentError && commentError.length && (
            <Box mb={6}>
              <Banner type="error" variant="error" label={commentError} />
            </Box>
          )}
        </FormControl>
      ) : (
        <Box>
          <FormControl>
            {proposalState === "active" || proposalState === "pending" ? (
              <Box onClick={() => setHelpMessage("connectWalletMessage")}>
                <CommentInput
                  onSend={async (comment) => {
                    console.log(comment);
                  }}
                />
              </Box>
            ) : (
              <Banner label="Comments are now closed." />
            )}
          </FormControl>
        </Box>
      )}
      {allComments.length > 0 ? (
        <>
          <AppBar.Root>
            <AppBar.Group mobileDirection="row" gap="standard.sm">
              <Box minWidth={"52px"}>
                <Text variant="mediumStrong">Sort by</Text>
              </Box>
              <Select
                size="sm"
                aria-label="Sort by"
                focusBorderColor={"red"}
                rounded="md"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "upvotes" | "date")
                }
              >
                <option selected hidden disabled value="">
                  Sort by
                </option>
                {sortByOptions.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </AppBar.Group>
          </AppBar.Root>
          <Box mt="standard.xs">
            <CommentList
              fetchMoreReplies={fetchMoreReplies}
              commentsList={allComments || []}
              onVote={handleCommentVote}
              onDelete={handleCommentDelete}
              onReply={handleReplySend}
              onEdit={handleCommentEdit}
            />
          </Box>
        </>
      ) : (
        <EmptyState
          hasBorder={false}
          type="comments"
          title={
            proposalState === "active" || proposalState === "pending"
              ? "Add the first comment"
              : "There are no comments"
          }
        />
      )}
      {/*
            <Banner label="Comments are now closed." />
            */}
      {comments?.data?.moreCommentsAvailable && (
        <>
          <HStack
            position="relative"
            spacing="0"
            h="80px"
            bgGradient="linear-gradient(0deg, #F9F8F9 0%, rgba(249, 248, 249, 0.50) 100%)"
          >
            <Divider />
            <Button
              minWidth="180px"
              variant="secondary"
              size="standard"
              onClick={onLoadMoreComments}
            >
              View More Comments
            </Button>
            <Divider />
          </HStack>
        </>
      )}
    </VoteLayout.Discussion>
  );
};

export default VotingProposalComments;
