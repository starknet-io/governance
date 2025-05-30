import {
  Box,
  Flex,
  Text,
  Image,
  Skeleton,
  Badge,
  Avatar,
} from "@chakra-ui/react";

import VotingProposalIcon from "../assets/voting_proposal_icon.svg";
import LearnIcon from "../assets/learn_icon.svg";
import { format } from "date-fns";
import slugify from "slugify";
import { Indenticon } from "../../Indenticon";
import { IProposalWithComments } from "@yukilabs/governance-backend/src/routers/proposals";

export type SearchItemType =
  | "voting_proposal"
  | "council"
  | "learn"
  | "delegate";
type BuildItemsType = "item-list" | "grouped-items";

export interface ISearchItem {
  name: string;
  type: SearchItemType;
  address?: string;
  objectID: string;
  refID: string | number;
  avatar?: string;
  proposal?: IProposalWithComments;
}

const GroupNames: Record<SearchItemType, string> = {
  voting_proposal: "Voting proposals",
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

export function getSearchItemHref(
  type: SearchItemType,
  id: number | string,
  title?: string,
) {
  if (type === "learn" && title) {
    const sluggedTitle = slugify(title ?? "", {
      replacement: "_",
      lower: true,
    });
    return `${HrefItems[type]}/${sluggedTitle}`;
  }
  const href = `${HrefItems[type]}/${id}`;
  return href;
}

export function buildSearchItems(
  searchItems = [] as ISearchItem[],
  type: BuildItemsType = "item-list",
  highlightedItem?: ISearchItem,
) {
  if (type === "grouped-items") {
    return buildGroupList(searchItems, highlightedItem);
  }
  return buildList(searchItems, highlightedItem);
}

function buildList(searchItems: ISearchItem[], highlightedItem?: ISearchItem) {
  return searchItems.map((searchItem) => {
    const isHighlightedItem = searchItem.objectID === highlightedItem?.objectID;

    // console.log({ in: highlightedItem, searchItem, isHighlightedItem });
    switch (searchItem.type) {
      case "voting_proposal": {
        return (
          <HoverBox
            isHighlightedItem={isHighlightedItem}
            data={searchItem}
            key={searchItem.objectID}
          >
            <VotingProposalItem data={searchItem} />
          </HoverBox>
        );
      }

      case "council": {
        return (
          <HoverBox
            isHighlightedItem={isHighlightedItem}
            data={searchItem}
            key={searchItem.objectID}
          >
            <CouncilItem data={searchItem} />
          </HoverBox>
        );
      }

      case "learn": {
        return (
          <HoverBox
            isHighlightedItem={isHighlightedItem}
            data={searchItem}
            key={searchItem.objectID}
          >
            <LearnItem data={searchItem} />
          </HoverBox>
        );
      }

      case "delegate": {
        return (
          <HoverBox
            isHighlightedItem={isHighlightedItem}
            data={searchItem}
            key={searchItem.objectID}
          >
            <DelegateItem data={searchItem} />
          </HoverBox>
        );
      }

      default:
        return null;
    }
  });
}

function buildGroupList(
  searchItems: ISearchItem[],
  highlightedItem?: ISearchItem,
) {
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
        <Text
          variant="bodyMedium"
          fontWeight="semibold"
          color="#86848D"
          p="standard.sm"
          pb="standard.base"
        >
          {GroupNames?.[group.type] ?? ""}
        </Text>
        <Box>{buildList(group.items, highlightedItem)}</Box>
      </Box>
    );
  });
}

function VotingProposalItem({ data }: { data: ISearchItem }) {
  const proposalData = data?.proposal;

  return (
    <Flex>
      <Flex
        borderRadius="md"
        border="1px solid rgba(35, 25, 45, 0.10)"
        alignItems="center"
        justifyContent="center"
        mr="4"
        height="min-content"
        p="standard.md"
        bg="surface.onBg.default"
      >
        <Image
          width="8"
          height="8"
          src={VotingProposalIcon}
          alt="voting proposal icon"
        />
      </Flex>
      <Flex flexDirection="column" justifyContent="center" width="100%">
        <Text
          fontWeight="semibold"
          variant="bodyMedium"
          color="content.accent.default"
          wordBreak="break-word"
        >
          {data.name}
        </Text>
        <Flex height="20px" alignItems="center">
          {proposalData ? (
            <>
              <Badge
                display="flex"
                alignItems="center"
                justifyContent="center"
                mr="2"
                borderRadius="standard.base"
                variant={proposalData.state}
                fontSize="10px"
                p="1"
              >
                {proposalData.state}
              </Badge>
              <Text fontSize="smaller" color="#4A4A4F">
                {format(new Date(proposalData.start * 1000), "yyyy-MM-dd")} •{" "}
                {proposalData?.comments?.length || 0} comments
              </Text>
            </>
          ) : (
            <Skeleton height="10px" width="40%" />
          )}
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
    <Flex>
      <Flex
        mr="4"
        alignItems="center"
        justifyContent="center"
        p="standard.base"
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
    <Flex>
      <Flex
        mr="4"
        alignItems="center"
        justifyContent="center"
        p="standard.base"
      >
        {data.avatar ? (
          <Avatar width="14" height="14" src={data.avatar} />
        ) : (
          <Indenticon address={data?.address} />
        )}
      </Flex>
      <Flex flexDirection="column" justifyContent="center">
        <Text fontWeight="semibold" fontSize="sm" wordBreak="break-word">
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
    <Flex>
      <Flex
        borderRadius="md"
        border="1px solid #23192D1A"
        alignItems="center"
        justifyContent="center"
        mr="4"
        p="standard.md"
        bg="surface.onBg.default"
      >
        <Image width="8" height="8" src={LearnIcon} alt="learn icon" />
      </Flex>
      <Flex flexDirection="column" justifyContent="center">
        <Text fontWeight="semibold" fontSize="sm" wordBreak="break-word">
          {data.name}
        </Text>
        <Text fontSize="smaller" fontWeight="medium" color="grey">
          Learn
        </Text>
      </Flex>
    </Flex>
  );
}

function HoverBox({
  children,
  data,
  isHighlightedItem,
}: {
  children: any;
  data: ISearchItem;
  isHighlightedItem?: boolean;
}) {
  let href = getSearchItemHref(data.type, data.refID, data.name);

  if (data.type === "delegate") {
    href = href.replace("/delegates/", "/delegates/profile/");
  }
  return (
    <Box as="a" href={href}>
      <Box
        sx={{
          backgroundColor: isHighlightedItem
            ? "surface.forms.hover"
            : undefined,
        }}
        _hover={{
          backgroundColor: "surface.forms.hover",
        }}
        py="standard.base"
        px="standard.sm"
      >
        {children}
      </Box>
    </Box>
  );
}
