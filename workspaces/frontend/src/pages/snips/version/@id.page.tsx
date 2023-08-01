import { DocumentProps } from "src/renderer/types";

import {
  Box,
  Heading,
  ContentContainer,
  Stack,
  Flex,
  Stat,
  Divider,
  Alert,
  AlertTitle,
  AlertIcon,
  DividerWithText,
  CommentList,
  QuillEditor,
  Iframely,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { usePageContext } from "src/renderer/PageContextProvider";

export function Page() {
  const pageContext = usePageContext();

  const snipId = parseInt(pageContext.routeParams!.id);

  const snip = trpc.snips.getSnipVersion.useQuery({
    id: snipId,
  });

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
              <Alert status="error" bg="#4A4A4F">
                <AlertIcon color="#fff" />
                <AlertTitle color="#fff" fontSize={14} fontWeight={500}>
                  You are viewing old version of this SNIP
                </AlertTitle>
              </Alert>
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
              </Box>
              <Flex gap="16px" paddingTop="0" alignItems="center">
                <Stat.Root>
                  <Stat.Status status={snip.data?.status} />
                </Stat.Root>
                <Stat.Root>
                  <Stat.Text
                    label={`By ${
                      snip.data?.author?.ensName || snip.data?.author?.address
                    }`}
                  />
                </Stat.Root>
                <Stat.Root>
                  <Stat.Date date={snip?.data?.createdAt} />
                </Stat.Root>

                <Stat.Root>
                  <Stat.Link
                    href="#discussion"
                    label={`${snip?.data?.totalComments || 0} comments`}
                  />
                </Stat.Root>
              </Flex>
              <Divider />

              {snip?.data?.discussionURL ? (
                <Iframely
                  id={import.meta.env.VITE_APP_IFRAMELY_ID}
                  url={snip?.data?.discussionURL || ""}
                />
              ) : (
                <></>
              )}
              <Divider />

              <Heading color="#33333E" variant="h3">
                Overview
              </Heading>

              <QuillEditor
                value={snip.data?.description || undefined}
                readOnly
              />

              <Divider my="32px" />
              <Heading id="#discussion" color="#33333E" variant="h3">
                Discussion
              </Heading>
              {snip.data?.versions &&
                Object.keys(snip.data.versions).map((snipVersion) => {
                  return (
                    <>
                      <DividerWithText
                        text={`v${snip?.data?.versions?.[snipVersion]?.version} comments`}
                      />
                      <CommentList
                        commentsList={
                          snip?.data?.versions?.[snipVersion]?.comments || []
                        }
                      />
                    </>
                  );
                })}
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
