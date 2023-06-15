import { DocumentProps } from "src/renderer/types";

import {
  Box,
  SummaryItems,
  Divider,
  ContentContainer,
  Stack,
  Heading,
  Text,
  ListRow,
  ProfileSummaryCard,
  Collapse,
} from "@yukilabs/governance-components";

export function Page() {
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
            address="aasdfasdfas33332"
            ethAddress="32423423423"
          >
            <ProfileSummaryCard.MoreActions
              onClick={() => console.log("red")}
            />
          </ProfileSummaryCard.Profile>
        </ProfileSummaryCard.Root>
        <Divider my="24px" />
        <Box>
          <Text variant="body" color="#545464">
            The Security Council is comprised of 17 builders from the Starknet
            Ecosystem, chosen by the Foundation on merit of their expertise and
            deep knowledge of Starknet.
          </Text>
        </Box>
        <Divider my="24px" />
        <SummaryItems.Root>
          <SummaryItems.Title label="Stats" />
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
                The role of the Security Council
              </Heading>

              <Text variant="body">
                Carry out an in-depth learning and discussion process for each
                proposed decision, with the aim to lead to well-founded
                decisions that will benefit StarkNet and its long-term vision.
              </Text>
              <Text variant="body">
                Take an active part in encouraging discussions and votes during
                the first phase on behalf of StarkNet community members.
              </Text>
              <Text variant="body">
                Ensure transparency of the Council’s discussions, decisions, and
                activities.
              </Text>
              <Text variant="body">
                Take an active part in encouraging discussions and votes during
                the first phase on behalf of StarkNet community members.
              </Text>
              <Text variant="body">
                Ensure transparency of the Council’s discussions, decisions, and
                activities.
              </Text>
              <Text variant="body">
                Take an active part in encouraging discussions and votes during
                the first phase on behalf of StarkNet community members.
              </Text>
              <Text variant="body">
                Ensure transparency of the Council’s discussions, decisions, and
                activities.
              </Text>
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
  title: "Councils / Security Council",
} satisfies DocumentProps;
