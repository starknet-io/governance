import { DocumentProps } from "src/renderer/types";

import {
  Box,
  Heading,
  ContentContainer,
  Stack,
  Flex,
  Stat,
  Divider,
  FormControl,
  QuillEditor,
  CommentInput,
  CommentList,
  IconButton,
  HiEllipsisHorizontal,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { usePageContext } from "src/renderer/PageContextProvider";
import { useDynamicContext } from "@dynamic-labs/sdk-react";

export function Page() {
  const pageContext = usePageContext();

  const { user } = useDynamicContext();

  const snip = trpc.snips.getSNIP.useQuery({
    id: parseInt(pageContext.routeParams!.id),
  });

  const saveComment = trpc.comments.saveComment.useMutation({
    onSuccess: () => {
      snip.refetch();
    },
  });

  const handleCommentSend = async (value: string) => {
    try {
      await saveComment.mutateAsync({
        content: value,
        snipId: parseInt(pageContext.routeParams!.id),
      });
    } catch (error) {
      // Handle error
      console.log(error);
    }
    console.log(value);
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
                    {snip.data?.title}
                  </Heading>
                </Box>
                <IconButton
                  variant="simple"
                  onClick={() => console.log("clicked")}
                  aria-label="Search database"
                  icon={<HiEllipsisHorizontal size="24px" />}
                />
              </Box>
              <Flex gap="16px" paddingTop="0" alignItems="center">
                <Stat.Root>
                  <Stat.Status status={snip.data?.status} />
                </Stat.Root>
                <Stat.Root>
                  <Stat.Text label={`By cillian`} />
                </Stat.Root>
                <Stat.Root>
                  <Stat.Date date={snip?.data?.createdAt} />
                </Stat.Root>

                <Stat.Root>
                  <Stat.Link label={`${snip.data?.comments.length} comments`} />
                </Stat.Root>
              </Flex>
              <Divider />

              <Heading color="#33333E" variant="h3">
                Overview
              </Heading>
              <QuillEditor
                value={snip.data?.description || undefined}
                readOnly
              />
              <Divider my="32px" />
              <Heading color="#33333E" variant="h3">
                Discussion
              </Heading>
              {user ? (
                <FormControl id="delegate-statement">
                  <CommentInput onSend={handleCommentSend} />
                </FormControl>
              ) : (
                <></>
              )}
              <CommentList commentsList={snip.data?.comments || []} />
            </Stack>
          </Box>
        </ContentContainer>
      </Box>
      <Box></Box>
    </>
  );
}

export const documentProps = {
  title: "Snips Proposal",
} satisfies DocumentProps;
