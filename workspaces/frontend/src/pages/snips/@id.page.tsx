import { DocumentProps } from "src/renderer/types";

import {
  Box,
  Heading,
  ContentContainer,
  Stack,
  Flex,
  Stat,
  Divider,
  Textarea,
  FormControl,
  QuillEditor,
  IconButton,
  HiEllipsisHorizontal,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { usePageContext } from "src/renderer/PageContextProvider";

export function Page() {
  const pageContext = usePageContext();

  const snip = trpc.proposals.getSNIP.useQuery({
    id: parseInt(pageContext.routeParams!.id),
  });

  console.log(snip.data);
  const commentCount = 0;
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
                  <Stat.Date timestamp={snip?.data?.createdAt} />
                </Stat.Root>

                <Stat.Root>
                  <Stat.Link label={`${commentCount} comments`} />
                </Stat.Root>
              </Flex>
              <Divider />

              <Heading color="#33333E" variant="h3">
                Overview
              </Heading>
              {/* // markdown comp */}
              {/* <Text variant="body">{snip.data?.description}</Text> */}
              <QuillEditor
                value={snip.data?.description || undefined}
                readOnly
              />
              <Divider my="32px" />
              <Heading color="#33333E" variant="h3">
                Discussion
              </Heading>
              <FormControl id="delegate-statement">
                <Textarea
                  rows={1}
                  variant="comment"
                  placeholder="Type your message..."
                />
              </FormControl>
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
