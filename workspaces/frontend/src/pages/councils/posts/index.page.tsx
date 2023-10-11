import { DocumentProps, ROLES } from "src/renderer/types";
import {
  Box,
  Heading,
  FormControl,
  Stack,
  ContentContainer,
  CommentInput,
  CommentList,
  Flex,
  Stat,
  Divider,
  ProfileSummaryCard,
  MenuItem,
  MarkdownRenderer,
  Text,
  Username,
  Skeleton,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { usePageContext } from "src/renderer/PageContextProvider";
import { hasPermission } from "src/utils/helpers";
import { truncateAddress } from "@yukilabs/governance-components/src/utils";

export function Page() {
  const pageContext = usePageContext();
  const postResp = trpc.posts.getPostBySlug.useQuery({
    slug: pageContext.routeParams!.postSlug,
  });

  const { data: post, isLoading: postLoading } = postResp;
  const { user } = usePageContext();

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
      console.log(error);
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
      console.log(error);
    }
    console.log(content);
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
      console.log(error);
    }
    console.log(content);
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
  return (
    <>
      <Box
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
        flex="1"
        height="100%"
      >
        <ContentContainer>
          <Box width="100%" maxWidth="710px" pb="200px" mx="auto">
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
                  <Box display="flex" alignItems="center">
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
                      ROLES.MODERATOR,
                    ]) ? (
                      <ProfileSummaryCard.MoreActions>
                        <MenuItem
                          as="a"
                          href={`/councils/${
                            pageContext.routeParams!.slug
                          }/posts/${post?.slug}/edit`}
                        >
                          Edit
                        </MenuItem>
                      </ProfileSummaryCard.MoreActions>
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
                    placeholder="Type your comment"
                    onSend={handleCommentSend}
                  />
                </FormControl>
              ) : (
                <></>
              )}
              {commentsLoading ? (
                // Skeleton representation for comments loading state
                <Box display="flex" flexDirection="column" gap="20px">
                  <Skeleton height="40px" width="100%" />
                  <Skeleton height="40px" width="100%" />
                  <Skeleton height="40px" width="100%" />
                </Box>
              ) : (
                // Actual comments content
                <CommentList
                  commentsList={commentsData || []}
                  onVote={handleCommentVote}
                  onReply={handleReplySend}
                  onDelete={handleCommentDelete}
                  onEdit={handleCommentEdit}
                />
              )}
            </Stack>
          </Box>
        </ContentContainer>
      </Box>
    </>
  );
}

export const documentProps = {
  title: "Post",
} satisfies DocumentProps;
