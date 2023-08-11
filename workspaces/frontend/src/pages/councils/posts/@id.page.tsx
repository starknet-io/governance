import { DocumentProps } from "src/renderer/types";
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
  MarkdownRenderer
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { usePageContext } from "src/renderer/PageContextProvider";
import { useDynamicContext } from "@dynamic-labs/sdk-react";

export function Page() {
  const pageContext = usePageContext();
  const postResp = trpc.posts.getPostById.useQuery({
    id: Number(pageContext.routeParams!.id),
  });

  const { data: post } = postResp;
  const { user } = useDynamicContext();

  const saveComment = trpc.comments.saveComment.useMutation({
    onSuccess: () => {
      postResp.refetch();
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
              color="#545464"
            >
              <Box display="flex" alignItems="center">
                <Box flex="1">
                  <Heading
                    color="#33333E"
                    variant="h3"
                    maxWidth="90%"
                    lineHeight="1.4em"
                  >
                    {post?.title}
                  </Heading>
                </Box>
                {user ? (
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
              <Heading id="#discussion" color="#33333E" variant="h3">
                Discussion
              </Heading>
              {user ? (
                <FormControl id="delegate-statement">
                  <CommentInput onSend={handleCommentSend} />
                </FormControl>
              ) : (
                <></>
              )}
              <CommentList commentsList={post?.comments || []} />
            </Stack>
          </Box>
        </ContentContainer>
      </Box>
    </>
  );
}

export const documentProps = {
  title: "Post / Create",
} satisfies DocumentProps;
