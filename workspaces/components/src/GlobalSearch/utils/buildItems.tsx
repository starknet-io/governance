import { Box, Flex, Text, Image } from "@chakra-ui/react";

import VotingProposalIcon from "../assets/voting_proposal_icon.svg";
import LearnIcon from "../assets/learn_icon.svg";

export type SearchItemType =
  | "voting_proposal"
  | "council"
  | "learn"
  | "delegate";
type BuildItemsType = "item-list" | "grouped-items";

export interface ISearchItem {
  name: number;
  type: SearchItemType;
  objectID: string;
  refID: string | number;
}

const GroupNames: Record<SearchItemType, string> = {
  voting_proposal: "Voting proposal",
  council: "Council",
  learn: "Learn",
  delegate: "Delegate",
};

const HrefItems: Record<SearchItemType, string> = {
  voting_proposal: "/voting-proposals",
  council: "/councils",
  learn: "/learn",
  delegate: "/delegates",
};

export function buildSearchItems(
  searchItems = [] as ISearchItem[],
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
          <HoverBox data={searchItem} key={searchItem.objectID}>
            <VotingProposalItem data={searchItem} />
          </HoverBox>
        );
      }

      case "council": {
        return (
          <HoverBox data={searchItem} key={searchItem.objectID}>
            <CouncilItem data={searchItem} />
          </HoverBox>
        );
      }

      case "learn": {
        return (
          <HoverBox data={searchItem} key={searchItem.objectID}>
            <LearnItem data={searchItem} />
          </HoverBox>
        );
      }

      case "delegate": {
        return (
          <HoverBox data={searchItem} key={searchItem.objectID}>
            <DelegateItem data={searchItem} />
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

function VotingProposalItem({ data }: { data: ISearchItem }) {
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
          {data.name}
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

function CouncilItem({ data }: { data: ISearchItem }) {
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
          {data.name}
        </Text>
        <Text fontSize="smaller" fontWeight="medium" color="grey">
          Council
        </Text>
      </Flex>
    </Flex>
  );
}

function DelegateItem({ data }: { data: ISearchItem }) {
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
          {data.name}
        </Text>
        <Text fontSize="smaller" fontWeight="medium" color="grey">
          Delegates
        </Text>
      </Flex>
    </Flex>
  );
}

function LearnItem({ data }: { data: ISearchItem }) {
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
          {data.name}
        </Text>
        <Text fontSize="smaller" fontWeight="medium" color="grey">
          Learn
        </Text>
      </Flex>
    </Flex>
  );
}

function HoverBox({ children, data }: { children: any; data: ISearchItem }) {
  const href = `${HrefItems[data.type]}/${data.refID}`;
  return (
    <Box as="a" href={href}>
      <Box
        _hover={{
          backgroundColor: "#4826480F",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
