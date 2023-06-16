import { DocumentProps } from "src/renderer/types";
import { useState } from "react";
import {
  Box,
  ButtonGroup,
  ContentContainer,
  Divider,
  Flex,
  Heading,
  LinkCard,
  Stack,
  Stat,
  SummaryItems,
  Text,
  VoteButton,
  VoteComment,
  VoteModal,
  VoteStat,
} from "@yukilabs/governance-components";
import { gql } from "src/gql";
import { useQuery } from "@apollo/client";
import { usePageContext } from "src/renderer/PageContextProvider";

export function Page() {
  const pageContext = usePageContext();

  const { data } = useQuery(
    gql(`query Proposal($id: String!) {
    proposal(id:$id) {
      id
      title
      choices
      votes
      scores
      scores_by_strategy
      scores_state
      scores_total
      scores_updated
      strategies {
        network
        params
      }
    }
  }`),
    {
      variables: {
        id: pageContext.routeParams!.id,
      },
    }
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Box
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      flex="1"
      height="100%"
    >
      <VoteModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <ContentContainer>
        <Box width="100%" maxWidth="662px" pb="200px" mx="auto">
          <Stack spacing="24px" direction={{ base: "column" }} color="#545464">
            <Heading color="#33333E" variant="h3">
              {data?.proposal?.title}
            </Heading>
            <Flex gap="80px" paddingTop="24px">
              <Stat.Root>
                <Stat.Label>Type</Stat.Label>
                <Stat.Text label={"Voting proposal"} />
              </Stat.Root>
              <Stat.Root>
                <Stat.Label>Status</Stat.Label>
                <Stat.Status status={"closed"} />
              </Stat.Root>
              <Stat.Root>
                <Stat.Label>Created on</Stat.Label>
                <Stat.Date timestamp={`Jun 25, 2023, 5:00 PM`} />
              </Stat.Root>
              <Stat.Root>
                <Stat.Label>Created by</Stat.Label>
                <Stat.Text label={"-"} />
              </Stat.Root>
            </Flex>
            <Box mt="24px" mb="24px">
              <LinkCard />
            </Box>

            <Heading color="#33333E" variant="h3">
              Overview
            </Heading>
            <Text variant="body">
              Namespaces are a very powerful (although undocumented) way to
              write Cairo modules. It allows scoping function definitions under
              an identifier 17, helping prevent collisions when importing
              functions from multiple modules.
            </Text>
            <Text variant="body">
              Nevertheless, the current implementation does not allow to scope
              storage variables (or functions representing them) within
              namespaces, opening the door for storage collisions in the case of
              two modules defining the same storage variable
            </Text>
            <Text variant="body">
              Namespaces are a very powerful (although undocumented) way to
              write Cairo modules. It allows scoping function definitions under
              an identifier 17, helping prevent collisions when importing
              functions from multiple modules.
            </Text>
            <Heading color="#33333E" variant="h3">
              Next up
            </Heading>
            <Text variant="body">
              Namespaces are a very powerful (although undocumented) way to
              write Cairo modules. It allows scoping function definitions under
              an identifier 17, helping prevent collisions when importing
              functions from multiple modules.
            </Text>
            <Heading color="#33333E" variant="h3">
              Review
            </Heading>
            <Text variant="body">
              Namespaces are a very powerful (although undocumented) way to
              write Cairo modules. It allows scoping function definitions under
              an identifier 17, helping prevent collisions when importing
              functions from multiple modules.
            </Text>
            <Text variant="body">Let’s Keep Starknet Strange together.</Text>
          </Stack>
        </Box>
      </ContentContainer>
      <Box
        pt="40px"
        px="32px"
        borderLeft="1px solid #E7E8E9"
        display="flex"
        flexDirection="column"
        flexBasis={{ base: "100%", md: "391px" }}
        height="100%"
        pb="100px"
      >
        <Heading variant="h4" mb="16px" fontWeight="500 " fontSize="16px">
          Cast your vote
        </Heading>
        <ButtonGroup
          mb="40px"
          spacing="8px"
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
        >
          <VoteButton
            onClick={() => setIsOpen(true)}
            active
            type="for"
            label="For"
          />
          <VoteButton type="against" label="Against" />
          <VoteButton type="abstain" label="Abstain" />
        </ButtonGroup>
        <Divider mb="40px" />
        <Box mb="40px">
          <Heading variant="h4" mb="16px" fontWeight="500 " fontSize="16px">
            Results
          </Heading>

          {data?.proposal?.choices.map((choice) => (
            <VoteStat key={choice} type="Abstain" />
          ))}
        </Box>
        <Divider mb="40px" />
        <Box mb="40px">
          <Heading variant="h4" mb="16px" fontWeight="500 " fontSize="16px">
            Votes
          </Heading>
          <VoteComment />
          <VoteComment voted="Against" />
          <VoteComment voted="Abstain" />
          <VoteComment />
        </Box>
        <Divider mb="40px" />
        <SummaryItems.Root>
          <SummaryItems.Title label="Vote information" />
          <SummaryItems.Item label="Stategies" value="Type" />
          <SummaryItems.Item label="IPFS" value="#dfbv892379" />
          <SummaryItems.Item label="Voting system" value="Single choice vote" />
          <SummaryItems.Item label="Snapshot" value="1,845,023" />
        </SummaryItems.Root>
      </Box>
    </Box>
  );
}

export const documentProps = {
  title: "Proposals / Voting",
} satisfies DocumentProps;
