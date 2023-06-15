import { DocumentProps } from "src/renderer/types";

import {
  Box,
  Text,
  Heading,
  ContentContainer,
  Stack,
  Flex,
  Stat,
  Divider,
  Textarea,
  FormControl,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { usePageContext } from "src/renderer/PageContextProvider";

export function Page() {
  const pageContext = usePageContext();

  const snip = trpc.proposals.getSNIP.useQuery({
    id: parseInt(pageContext.routeParams!.id),
  });

  console.log(snip.data);

  return (
    <>
      <Box
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
        flex="1"
        height="100%"
      >
        <ContentContainer>
          <Box width="100%" maxWidth="662px" pb="200px" mx="auto">
            <Stack
              spacing="24px"
              direction={{ base: "column" }}
              color="#545464"
            >
              <Heading color="#33333E" variant="h3">
                {snip.data?.title}
              </Heading>
              <Flex gap="90px" paddingTop="24px">
                <Stat.Root>
                  <Stat.Label>Type</Stat.Label>
                  <Stat.Text label={snip.data?.type} />
                </Stat.Root>
                <Stat.Root>
                  <Stat.Label>Status</Stat.Label>
                  <Stat.Status status={snip.data?.status} />
                </Stat.Root>
                <Stat.Root>
                  <Stat.Label>Created on</Stat.Label>
                  <Stat.Date timestamp={`${snip.data?.createdAt}`} />
                </Stat.Root>
                <Stat.Root>
                  <Stat.Label>Created by</Stat.Label>
                  <Stat.Text label={"-"} />
                </Stat.Root>
              </Flex>
              <Divider />
              <Heading color="#33333E" variant="h3">
                Overview
              </Heading>
              {/* // markdown comp */}
              <Text variant="body">{snip.data?.description}</Text>
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
