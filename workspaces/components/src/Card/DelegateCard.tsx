import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Box,
  Text,
  LinkBox,
  LinkOverlay,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { Tag } from "../Tag";
import { Button } from "../Button";
import { MarkdownRenderer } from "../MarkdownRenderer";
import { formatVotesAmount } from "src/utils";
import "./karma.css";

import { AvatarWithText } from "src/AvatarWithText";
import { Tooltip } from "src/Tooltip";
import {
  DiscordIcon,
  DiscourseIcon,
  TelegramIcon,
  TwitterIcon,
} from "src/Icons";
import { IconButton } from "src/IconButton";

export type DelegateCardProps = {
  statement: string | null;
  type: string[];
  votingPower: number;
  voteCount?: number;
  onDelegateClick?: () => void;
  profileURL?: string;
  address: string | null | undefined;
  user?: string | null;
  src?: string | null;
  isDelegationLoading?: boolean;
  headerTooltipContent?: string;
  twitter?: string;
  discord?: string;
  discourse?: string;
  telegram?: string;
};

const delegateInterests: Record<string, string> = {
  cairo_dev: "Cairo Dev",
  daos: "DAOs",
  governance: "Governance",
  identity: "Identity",
  infrastructure: "Infrastructure",
  infrastructure_starknet_dev: "Infrastructure Starknet dev",
  legal: "Legal",
  professional_delegate: "Professional delegate",
  security: "Security",
  starknet_community: "Starknet community",
  web3_community: "Web3 community",
  web3_developer: "Web3 developer",
  gaming: "Gaming",
  nft: "NFT",
  defi: "DeFi",
};

export function extractParagraph(
  markdownContent: string,
  charLimit = 300,
): string {
  // Remove headings
  const noHeadings = markdownContent.replace(/#+ .+\n/g, "").trim();

  const firstParagraphMatch = noHeadings.match(/(?:\n|^)([^#].+?)(?:\n|$)/);
  if (firstParagraphMatch && firstParagraphMatch[1]) {
    const firstParagraph = firstParagraphMatch[1];
    return firstParagraph.substring(0, charLimit);
  }
  return "";
}
const DelegateTags = ({
  type,
}: {
  type: (string | { value: string; label: string })[];
}) => {
  if (!Array.isArray(type) || type.length === 0) return null;

  const getTagValue = (item: string | { value: string; label: string }) => {
    if (typeof item === "string") {
      return delegateInterests?.[item] ?? item;
    } else {
      return item.label;
    }
  };

  const renderTags = (startIndex: number, endIndex: number) =>
    type.slice(startIndex, endIndex).map((item, index) => (
      <Tag size="condensed" style={{ pointerEvents: "none" }} key={index}>
        {getTagValue(item)}
      </Tag>
    ));

  const renderTooltip = (startIndex: number) => (
    <Tooltip
      hasArrow
      shouldWrapChildren
      placement="top"
      label={type
        .slice(startIndex)
        .map((t) => getTagValue(t))
        .join(", ")}
    >
      <Tag size="condensed">+{type.length - startIndex}</Tag>
    </Tooltip>
  );

  return (
    <Box height="18px" mb="standard.xs">
      {getTagValue(type[0]).length > 20 ? (
        <Box display="flex" gap="standard.base" height="18px">
          {renderTags(0, 1)}
          {type.length > 1 && renderTooltip(1)}
        </Box>
      ) : (
        <Box display="flex" gap="standard.base" height="18px">
          {renderTags(0, 2)}
          {type.length > 2 && renderTooltip(2)}
        </Box>
      )}
    </Box>
  );
};

export const DelegateCard = ({
  statement,
  type,
  votingPower,
  src,
  address,
  user,
  onDelegateClick,
  profileURL,
  isDelegationLoading,
  headerTooltipContent,
  twitter,
  discord,
  discourse,
  telegram,
}: DelegateCardProps) => {
  const votesFormatted = formatVotesAmount(votingPower) + " delegated votes";
  const formattedDelegateStatement = extractParagraph(statement || "");

  return (
    <LinkBox as={Card} variant="delegate">
      <CardHeader>
        <LinkOverlay href={profileURL}>
          <AvatarWithText
            size="condensed"
            headerText={user}
            headerTooltipContent={headerTooltipContent}
            subheaderText={votesFormatted}
            address={address}
            src={src}
          />
        </LinkOverlay>
      </CardHeader>
      <CardBody>
        <DelegateTags type={type} />
        <Box>
          <MarkdownRenderer
            className="karma-delegates"
            textProps={{
              fontSize: "14px",
              noOfLines: 3,
              color: "#4A4A4F",
              fontStyle: "normal!important",
              fontWeight: "400!important",

              marginTop: "-0px!important",
              marginBottom: "0px!important",
            }}
            content={formattedDelegateStatement || ""}
          />
        </Box>
      </CardBody>

      <CardFooter>
        <Box
          width="100%"
          display="flex"
          flexDirection="row"
          gap="standard.base"
        >
          <Box>
            {!isDelegationLoading ? (
              <Button
                size="condensed"
                variant="secondary"
                onClick={onDelegateClick}
              >
                Delegate
              </Button>
            ) : (
              <Button
                size="secondary"
                variant="outline"
                disabled
                gap={1.5}
                onClick={() => {
                  console.log("disabled");
                }}
              >
                <Spinner size="sm" />
                <Text variant="mediumStrong">Pending</Text>
              </Button>
            )}
          </Box>
          <Flex ml="auto" gap="standard.base">
            {twitter && (
              <IconButton
                size="condensed"
                variant="secondary"
                as="a"
                target="_blank"
                icon={<TwitterIcon />}
                {...({ href: `https://twitter.com/${twitter}` } as any)}
              />
            )}
            {telegram && (
              <IconButton
                size="condensed"
                variant="secondary"
                as="a"
                target="_blank"
                icon={<TelegramIcon />}
                {...({
                  href: `https://t.me/${telegram}`,
                } as any)}
              />
            )}
            {discord && (
              <IconButton
                size="condensed"
                variant="secondary"
                as="a"
                target="_blank"
                icon={<DiscordIcon />}
                {...({
                  href: `https://discord.com/${discord}`,
                } as any)}
              />
            )}
            {discourse && (
              <IconButton
                size="condensed"
                variant="secondary"
                as="a"
                target="_blank"
                icon={<DiscourseIcon />}
                {...({
                  href: `https://community.starknet.io/u/${discourse}`,
                } as any)}
              />
            )}
          </Flex>
        </Box>
      </CardFooter>
    </LinkBox>
  );
};
