import { DocumentProps } from "src/renderer/types";

import {
  Box,
  SummaryItems,
  Divider,
  ContentContainer,
  Stack,
  Heading,
  ListRow,
  ProfileSummaryCard,
  Collapse,
  QuillEditor,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { usePageContext } from "src/renderer/PageContextProvider";
import { useEffect } from "react";

export function Page() {
  const pageContext = usePageContext();

  const councilResp = trpc.councils.getCouncilBySlug.useQuery({
    slug: pageContext.routeParams!.id,
  });

  const { data: council } = councilResp;

  useEffect(() => {
    console.log("pageContext.routeParams", pageContext.routeParams);
  });

  return (
    <Box
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      flex="1"
      height="100%"
    >
      <Box
        pt="40px"
        px="32px"
        borderRight="1px solid #E7E8E9"
        display="flex"
        flexDirection="column"
        flexBasis={{ base: "100%", md: "391px" }}
        height="100%"
      >
        <ProfileSummaryCard.Root>
          <ProfileSummaryCard.Profile
            address="0x2EF324324234234234234234231234"
            ethAddress={council?.name ?? "Council"}
          >
            <ProfileSummaryCard.MoreActions
              onClick={() => console.log("red")}
            />
          </ProfileSummaryCard.Profile>
        </ProfileSummaryCard.Root>

        <Divider my="24px" />
        <Box>
          <QuillEditor value={council?.description ?? ""} readOnly />
        </Box>
        <Divider my="24px" />
        <SummaryItems.Root>
          <SummaryItems.Item label="Proposals voted on" value="6" />
          <SummaryItems.Item label="Delegated votes" value="7,000,000" />

          <SummaryItems.Item label="For/against/abstain" value="2/0/4" />
        </SummaryItems.Root>
      </Box>

      <ContentContainer maxWidth="800px">
        <Stack spacing="24px" direction={{ base: "column" }} color="#545464">
          <Collapse startingHeight={100}>
            <Stack
              spacing="24px"
              direction={{ base: "column" }}
              color="#545464"
            >
              <Heading color="#33333E" variant="h3">
                The role of the {council?.name ?? "Council"}
              </Heading>
              <QuillEditor value={council?.statement ?? ""} readOnly />
            </Stack>
          </Collapse>

          <Box mt="24px">
            <Heading color="#33333E" variant="h3">
              Posts
            </Heading>
            <ListRow.Container>
              <ListRow.Root>
                <ListRow.CommentSummary />
                <ListRow.Comments count={3} />
              </ListRow.Root>
              <ListRow.Root>
                <ListRow.CommentSummary />
                <ListRow.Comments count={3} />
              </ListRow.Root>
            </ListRow.Container>
          </Box>
          <Box mt="24px">
            <Heading color="#33333E" variant="h3">
              Past Votes
            </Heading>
            <ListRow.Container>
              <ListRow.Root>
                <ListRow.PastVotes />
                <ListRow.Comments count={3} />
              </ListRow.Root>
              <ListRow.Root>
                <ListRow.PastVotes />
                <ListRow.Comments count={3} />
              </ListRow.Root>
            </ListRow.Container>
          </Box>
        </Stack>
      </ContentContainer>
    </Box>
  );
}

export const documentProps = {
  title: "Councils / Builders",
} satisfies DocumentProps;
