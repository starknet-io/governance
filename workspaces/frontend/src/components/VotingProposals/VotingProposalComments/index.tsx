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
import { Select } from "@chakra-ui/react";
import * as VoteLayout from "../VotingProposal/PageLayout";
import {useDynamicContext} from "@dynamic-labs/sdk-react-core";
import {useHelpMessage} from "../../../hooks/HelpMessage";

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
}: {
  proposalId: string;
}) => {
  const [offset, setOffset] = useState(1);
  const [allComments, setAllComments] = useState([]);
  const [sortBy, setSortBy] = useState<"date" | "upvotes">("date");
  const [helpMessage, setHelpMessage] = useHelpMessage();


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

  const saveComment = trpc.comments.saveComment.useMutation({
    onSuccess: () => {
      comments.refetch();
    },
  });

  const editComment = trpc.comments.editComment.useMutation({
    onSuccess: () => {
      comments.refetch();
    },
  });

  const deleteComment = trpc.comments.deleteComment.useMutation({
    onSuccess: () => {
      comments.refetch();
    },
  });

  const voteComment = trpc.comments.voteComment.useMutation({
    onSuccess: () => {
      comments.refetch();
    },
  });

  const handleCommentSend = async (value: string) => {
    try {
      await saveComment.mutateAsync({
        content: value,
        proposalId: proposalId,
      });
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
      await saveComment.mutateAsync({
        content,
        parentId,
        proposalId: proposalId,
      });
    } catch (error) {
      // Handle error
      throw error;
    }
  };

  const handleCommentVote = async ({
    commentId,
    voteType,
  }: {
    commentId: number;
    voteType: "upvote" | "downvote";
  }) => {
    try {
      await voteComment.mutateAsync({
        commentId,
        voteType,
      });
    } catch (error) {
      // Handle error
      console.log(error);
    }
  };

  const commentCount = comments?.data?.comments?.length || 0;
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    if (sortBy && sortBy.length) {
      setOffset(1);
    }
  }, [sortBy]);

  useEffect(() => {
    if (comments.data && comments.data?.comments && !comments.isLoading) {
      setAllComments((prevComments) => [
        ...prevComments,
        ...comments.data?.comments,
      ]);
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
      {user ? (
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
            <Box onClick={() => setHelpMessage("connectWalletMessage")}>
              <CommentInput
                onSend={async (comment) => {
                  console.log(comment);
                }}
              />
            </Box>
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
          title="Add the first comment"
        />
      )}
      {/*
            <Banner label="Comments are now closed." />
            */}
      {comments?.data?.moreCommentsAvailable && (
        <>
          <Button variant="ghost" onClick={onLoadMoreComments}>
            View More Comments
          </Button>
        </>
      )}
    </VoteLayout.Discussion>
  );
};

export default VotingProposalComments;
