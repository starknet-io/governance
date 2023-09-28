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
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { usePageContext } from "src/renderer/PageContextProvider";
import { hasPermission } from "src/utils/helpers";

export function Page() {
  const pageContext = usePageContext();
  const postResp = trpc.posts.getPostById.useQuery({
    id: Number(pageContext.routeParams!.id),
  });

  const { data: post } = postResp;
  const { user } = usePageContext();

  const comments = trpc.posts.getPostComments.useQuery({
    postId: pageContext.routeParams!.id,
  });

  const saveComment = trpc.comments.saveComment.useMutation({
    onSuccess: () => {
      comments.refetch();
    },
  });

  const handleCommentSend = async (value: string) => {
    try {
      await saveComment.mutateAsync({
        content: value,
        postId: parseInt(pageContext.routeParams!.id),
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
        postId: parseInt(pageContext.routeParams!.id),
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
              spacing="24px"
              direction={{ base: "column" }}
              color="content.default.default"
            >
              <Box display="flex" alignItems="center">
                <Box flex="1">
                  <Heading
                    color="content.accent.default"
                    variant="h2"
                    maxWidth="90%"
                  >
                    {post?.title}
                  </Heading>
                </Box>
                {hasPermission(user?.role, [ROLES.ADMIN, ROLES.MODERATOR]) ? (
                  <ProfileSummaryCard.MoreActions>
                    <MenuItem as="a" href={`/councils/posts/edit/${post?.id}`}>
                      Edit
                    </MenuItem>
                  </ProfileSummaryCard.MoreActions>
                ) : (
                  <></>
                )}
              </Box>

              <Flex gap="16px" paddingTop="0" alignItems="center">
                <Stat.Root>
                  <Stat.Text label={`By cillian`} />
                </Stat.Root>
                <Stat.Root>
                  <Stat.Date date={post?.createdAt} />
                </Stat.Root>

                <Stat.Root>
                  <Stat.Link
                    href="#discussion"
                    label={`${post?.comments.length} comments`}
                  />
                </Stat.Root>
              </Flex>
              <Divider />

              <MarkdownRenderer content={post?.content || ""} />
              <Divider my="32px" />
              <Heading
                id="#discussion"
                color="content.accent.default"
                variant="h3"
              >
                Discussion
              </Heading>
              {user ? (
                <FormControl id="delegate-statement">
                  <CommentInput onSend={handleCommentSend} />
                </FormControl>
              ) : (
                <></>
              )}
              <CommentList
                commentsList={comments?.data || []}
                onVote={handleCommentVote}
                onReply={handleReplySend}
                onDelete={handleCommentDelete}
                onEdit={handleCommentEdit}
              />
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
