import { Box, Flex, Text, Image, Badge } from "@chakra-ui/react";

import VotingProposalIcon from "../assets/voting_proposal_icon.svg";
import LearnIcon from "../assets/learn_icon.svg";

export type SearchItemType = "voting_proposal" | "council" | "learn" | "delegate";
type BuildItemsType = "item-list" | "grouped-items";

interface ISearchItem {
  id: number;
  type: SearchItemType;
}

const GroupNames: Record<SearchItemType, string> = {
  voting_proposal: "Voting proposal",
  council: "Council",
  learn: "Learn",
  delegate: "Delegate",
};

const mockData: ISearchItem[] = [
  { type: "voting_proposal", id: 1 },
  { type: "voting_proposal", id: 2 },
  { type: "voting_proposal", id: 3 },
  { type: "council", id: 4 },
  { type: "delegate", id: 5 },
  { type: "learn", id: 6 },
  { type: "learn", id: 7 },
  { type: "voting_proposal", id: 8 },
  { type: "voting_proposal", id: 9 },
  { type: "voting_proposal", id: 10 },
  { type: "council", id: 11 },
  { type: "delegate", id: 12 },
  { type: "learn", id: 13 },
  { type: "learn", id: 14 },
];

export function buildSearchItems(
  searchItems = mockData,
  type: BuildItemsType = "item-list",
) {
  if (type === "grouped-items") {
    return buildGroupList(searchItems);
  }
  return buildList(searchItems);
}

function buildList(searchItems: ISearchItem[]) {
  return searchItems.map((searchItem) => {
    switch (searchItem.type) {
      case "voting_proposal": {
        return (
          <HoverBox>
            <VotingProposalItem />
          </HoverBox>
        );
      }

      case "council": {
        return (
          <HoverBox>
            <CouncilItem />
          </HoverBox>
        );
      }

      case "learn": {
        return (
          <HoverBox>
            <LearnItem />
          </HoverBox>
        );
      }

      case "delegate": {
        return (
          <HoverBox>
            <DelegateItem />
          </HoverBox>
        );
      }

      default:
        return null;
    }
  });
}

function buildGroupList(searchItems: ISearchItem[]) {
  const groupedItems: Partial<
    Record<SearchItemType, { type: SearchItemType; items: ISearchItem[] }>
  > = {};
  searchItems.forEach((item) => {
    if (item.type in groupedItems) {
      groupedItems[item.type] = {
        type: item.type,
        items: [...groupedItems[item.type]!.items, item],
      };
    } else {
      groupedItems[item.type] = { type: item.type, items: [item] };
    }
  });
  const groups = Object.values(groupedItems);

  return groups.map((group) => {
    return (
      <Box key={group.type}>
        <Text fontSize="small" fontWeight="semibold" color="#86848D" mb="2">
          {GroupNames?.[group.type] ?? ""}
        </Text>
        <Box>{buildList(group.items)}</Box>
      </Box>
    );
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

function HoverBox({ children }: { children: any }) {
  return (
    <Box
      _hover={{
        backgroundColor: "#4826480F",
      }}
    >
      {children}
    </Box>
  );
}
