import { Box, Flex, Text, Image, Badge } from "@chakra-ui/react";

import VotingProposalIcon from "../assets/voting_proposal_icon.svg";
import LearnIcon from "../assets/learn_icon.svg";

type SearchItemType = "voting_proposal" | "council" | "learn" | "delegate";

interface ISearchItem {
  type: SearchItemType;
}

const mockData: ISearchItem[] = [
  { type: "voting_proposal" },
  { type: "voting_proposal" },
  { type: "voting_proposal" },
  { type: "council" },
  { type: "delegate" },
  { type: "learn" },
  { type: "learn" },
  { type: "voting_proposal" },
  { type: "voting_proposal" },
  { type: "voting_proposal" },
  { type: "council" },
  { type: "delegate" },
  { type: "learn" },
  { type: "learn" },
];

export function buildSearchItems(searchItems = mockData) {
  return searchItems.map((searchItem) => {
    switch (searchItem.type) {
      case "voting_proposal": {
        return <VotingProposalItem />;
      }

      case "council": {
        return <CouncilItem />;
      }

      case "learn": {
        return <LearnItem />;
      }

      case "delegate": {
        return <DelegateItem />;
      }

      default:
        return null;
    }
  });
}

function VotingProposalItem() {
  return (
    <Flex mb="2">
      <Flex
        width="16"
        height="16"
        borderRadius="md"
        border="1px solid #23192D1A"
        backgroundColor="#F4F2F4"
        alignItems="center"
        justifyContent="center"
        mr="4"
      >
        <Image
          width="8"
          height="8"
          src={VotingProposalIcon}
          alt="voting proposal icon"
        />
      </Flex>
      <Flex flexDirection="column" justifyContent="center">
        <Text fontWeight="semibold" fontSize="sm">
          Dynamic layouts: faster, cheaper proving
        </Text>
        <Flex>
          {/* <Badge
                  // height="4"
                  mr="2"
                  borderRadius="base"
                  colorScheme="green"
                >
                  Active
                </Badge> */}
          <Text fontSize="smaller" color="#4A4A4F">
            8 Feb 2023 • 2 comments • Infrastructure
          </Text>
        </Flex>
        <Text fontSize="smaller" fontWeight="medium" color="grey">
          Voting proposals
        </Text>
      </Flex>
    </Flex>
  );
}

function CouncilItem() {
  return (
    <Flex mb="2">
      <Flex
        mr="4"
        width="16"
        height="16"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          width="14"
          height="14"
          borderRadius="full"
          background="linear-gradient(#040E56, #6B2EB7, #FA63F8)"
        />
      </Flex>
      <Flex flexDirection="column" justifyContent="center">
        <Text fontWeight="semibold" fontSize="sm">
          Builders Council
        </Text>
        <Text fontSize="smaller" fontWeight="medium" color="grey">
          Council
        </Text>
      </Flex>
    </Flex>
  );
}

function DelegateItem() {
  return (
    <Flex mb="2">
      <Flex
        mr="4"
        width="16"
        height="16"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          width="14"
          height="14"
          borderRadius="full"
          background="linear-gradient(#040E56, #6B2EB7, #FA63F8)"
        />
      </Flex>
      <Flex flexDirection="column" justifyContent="center">
        <Text fontWeight="semibold" fontSize="sm">
          manor.eth
        </Text>
        <Text fontSize="smaller" fontWeight="medium" color="grey">
          Delegates
        </Text>
      </Flex>
    </Flex>
  );
}

function LearnItem() {
  return (
    <Flex mb="2">
      <Flex
        width="16"
        height="16"
        borderRadius="md"
        border="1px solid #23192D1A"
        backgroundColor="#F4F2F4"
        alignItems="center"
        justifyContent="center"
        mr="4"
      >
        <Image width="8" height="8" src={LearnIcon} alt="learn icon" />
      </Flex>
      <Flex flexDirection="column" justifyContent="center">
        <Text fontWeight="semibold" fontSize="sm">
          Governance for dummies
        </Text>
        <Text fontSize="smaller" fontWeight="medium" color="grey">
          Learn
        </Text>
      </Flex>
    </Flex>
  );
}
