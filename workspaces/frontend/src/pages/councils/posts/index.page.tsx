import { DocumentProps, ROLES } from "#src/renderer/types";
import {
  Box,
  Heading,
  FormControl,
  Stack,
  CommentInput,
  CommentList,
  Flex,
  Stat,
  Divider,
  MenuItem,
  MarkdownRenderer,
  Text,
  Username,
  Skeleton,
  Banner,
  Dropdown,
  EllipsisIcon,
  EmptyState,
} from "@yukilabs/governance-components";
import { trpc } from "#src/utils/trpc";
import { usePageContext } from "#src/renderer/PageContextProvider";
import { extractAndFormatSlug, hasPermission } from "#src/utils/helpers";
import { truncateAddress } from "@yukilabs/governance-components/src/utils";
import { Grid } from "@chakra-ui/react";
import { BackButton } from "#src/components/Header/BackButton";
import { useState } from "react";
import { useHelpMessage } from "#src/hooks/HelpMessage";

export function Page() {
  const pageContext = usePageContext();
  const [helpMessage, setHelpMessage] = useHelpMessage();
  const postResp = trpc.posts.getPostBySlug.useQuery({
    slug: pageContext.routeParams!.postSlug,
  });

  const { data: post, isLoading: postLoading } = postResp;
  const { user } = usePageContext();
  const [commentError, setCommentError] = useState("");

  const comments = trpc.posts.getPostComments.useQuery(
    {
      postId: post?.id as number,
    },
    {
      enabled: !!post?.id,
    },
  );
  const { data: commentsData, isLoading: commentsLoading } = comments;

  const saveComment = trpc.comments.saveComment.useMutation({
    onSuccess: () => {
      comments.refetch();
    },
  });

  const handleCommentSend = async (value: string) => {
    try {
      await saveComment.mutateAsync({
        content: value,
        postId: post?.id,
      });
    } catch (error) {
      // Handle error
      throw error;
    }
  };

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
    console.log("Deleted");
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
        postId: post?.id,
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
  const formattedAddress = truncateAddress(`${post?.author?.address}`);

  const formattedSlug = extractAndFormatSlug(`${pageContext?.urlOriginal}`);

  return (
    <>
      <Grid
        bg="surface.bgPage"
        templateColumns={{
          base: "1fr",
        }}
        templateAreas={{
          base: `
          "postcontent"
        `,
        }}
      >
        <Box
          gridArea="postcontent"
          px={{
            base: "standard.md",
            md: "standard.2xl",
          }}
          pt={{ base: "standard.2xl", lg: "standard.3xl" }}
          pb={{ base: "standard.2xl", lg: "standard.3xl" }}
          maxWidth="100%"
          overflow={"hidden"}
        >
          <Box maxWidth={{ base: "100%", lg: "626px" }} mx="auto">
            <Box mb="standard.2xl" display={{ lg: "none" }}>
              <BackButton
                urlStart={[
                  "/councils/builder_council/",
                  "/councils/security_council/",
                ]}
                buttonText={formattedSlug}
                pageContext={pageContext}
              />
            </Box>
            <Stack
              spacing="0"
              direction={{ base: "column" }}
              color="content.default.default"
            >
              {postLoading ? (
                <Box display="flex" flexDirection="column" gap="12px">
                  <Skeleton height="60px" width="100%" />
                  <Skeleton height="40px" width="100%" />
                </Box>
              ) : (
                <>
                  <Box display="flex" alignItems="center" position={"relative"}>
                    <Box flex="1">
                      <Heading
                        color="content.accent.default"
                        variant="h2"
                        maxWidth="90%"
                        mb="16px"
                      >
                        {post?.title}
                      </Heading>
                    </Box>
                    {hasPermission(user?.role, [
                      ROLES.ADMIN,
                      ROLES.SUPERADMIN,
                      ROLES.MODERATOR,
                      ROLES.AUTHOR,
                    ]) ? (
                      <Box
                        width="44px"
                        height="44px"
                        position="absolute"
                        top="0"
                        right="0"
                      >
                        <Dropdown buttonIcon={<EllipsisIcon boxSize="20px" />}>
                          <MenuItem
                            as="a"
                            href={`/councils/${
                              pageContext.routeParams!.slug
                            }/posts/${post?.slug}/edit`}
                          >
                            Edit
                          </MenuItem>
                        </Dropdown>
                      </Box>
                    ) : (
                      <></>
                    )}
                  </Box>
                  <Flex
                    mb="24px"
                    gap="standard.xs"
                    paddingTop="0"
                    alignItems="center"
                  >
                    <Username
                      address={post?.author?.address}
                      displayName={
                        post?.author?.username ??
                        post?.author?.ensName ??
                        formattedAddress
                      }
                      src={
                        post?.author?.profileImage ??
                        post?.author?.ensAvatar ??
                        null
                      }
                      showTooltip={
                        !post?.author?.username && !post?.author?.ensName
                      }
                      tooltipContent={post?.author?.address}
                    />

                    <Text variant="small" color="content.default.default">
                      •
                    </Text>
                    <Stat.Root>
                      <Stat.Date date={post?.createdAt} />
                    </Stat.Root>
                    <Text variant="small" color="content.default.default">
                      •
                    </Text>
                    <Stat.Root>
                      <Stat.Link
                        href="#discussion"
                        label={`${post?.comments.length} comments`}
                      />
                    </Stat.Root>
                  </Flex>
                </>
              )}

              <Divider />

              <Box mt="standard.2xl">
                <MarkdownRenderer content={post?.content || ""} />
              </Box>
              <Divider my="32px" />
              <Heading
                id="discussion"
                color="content.accent.default"
                variant="h3"
                mb="standard.lg"
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
                      <Banner
                        type="error"
                        variant="error"
                        label={commentError}
                      />
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
              {commentsLoading ? (
                // Skeleton representation for comments loading state
                <Box display="flex" flexDirection="column" gap="20px">
                  <Skeleton height="40px" width="100%" />
                  <Skeleton height="40px" width="100%" />
                  <Skeleton height="40px" width="100%" />
                </Box>
              ) : commentsData && commentsData.length > 0 ? (
                // Actual comments content
                <CommentList
                  commentsList={commentsData}
                  onVote={handleCommentVote}
                  onReply={handleReplySend}
                  onDelete={handleCommentDelete}
                  onEdit={handleCommentEdit}
                />
              ) : (
                // Display EmptyState when there are no comments
                <EmptyState
                  hasBorder={false}
                  type="comments"
                  title="Add the first comment"
                />
              )}
            </Stack>
          </Box>
        </Box>
      </Grid>
    </>
  );
}

export const documentProps = {
  title: "Post",
  image: "/social/social-councils.png",
} satisfies DocumentProps;
