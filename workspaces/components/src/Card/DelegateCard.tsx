import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Box,
  Tooltip,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";

import { Tag } from "../Tag";
import { Button } from "../Button";
import * as ProfileSummaryCard from "src/ProfileSummaryCard/ProfileSummaryCard";
import { MarkdownRenderer } from "src/MarkdownRenderer";

type DelegateProps = {
  id: string;
  statement: string;
  type: string[];
  twitter?: string | null;
  discord?: string | null;
  discourse?: string | null;
  acceptStandardDelegateAgreement?: boolean | null;
  understandRole: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    address: string;
    publicIdentifier: string;
    role: string;
    ensName?: string | null;
    ensAvatar?: string | null;
    name?: string | null;
    twitter?: string | null;
    miniBio?: string | null;
    username?: string | null;
    starknetAddress?: string | null;
    createdAt: string;
    updatedAt: string;
  };
  votingIno?: {
    totalVotes: number;
    votingPower: number;
  };
  onDelegateClick?: () => void;
  profileURL?: string;
};

function extractParagraph(markdownContent: string, charLimit = 300): string {
  // Remove headings
  const noHeadings = markdownContent.replace(/#+ .+\n/g, "").trim();

  const firstParagraphMatch = noHeadings.match(/(?:\n|^)([^#].+?)(?:\n|$)/);
  if (firstParagraphMatch && firstParagraphMatch[1]) {
    const firstParagraph = firstParagraphMatch[1];
    return firstParagraph.substring(0, charLimit);
  }
  return "";
}

export const delegateNames: Record<string, string> = {
  cairo_dev: "Cairo Dev",
  daos: "DAOs",
  governance: "Governance",
  identity: "Identity",
  infrastructure: "Infrastructure",
  legal: "Legal",
  professional_delegate: "Professional delegate",
  security: "Security",
  starknet_community: "Starknet community",
  web3_community: "Web3 community",
  web3_developer: "Web3 developer",
};

export const DelegateCard = (props: DelegateProps) => {
  const { onDelegateClick, profileURL, votingIno, author, type, statement } =
    props;
  const votesFormatted = votingIno
    ? `${votingIno.totalVotes} Votes`
    : "0 Votes";
  const formattedDelegateStatement = extractParagraph(statement);
  return (
    <LinkBox as={Card} variant="delegate">
      <CardHeader>
        <LinkOverlay href={profileURL}>
          <ProfileSummaryCard.Root>
            <ProfileSummaryCard.Profile
              imgUrl={author.ensAvatar}
              size="sm"
              address={author.address}
              ensName={author.ensName}
              subtitle={votesFormatted.toUpperCase()}
              avatarString={author.address}
            />
          </ProfileSummaryCard.Root>
        </LinkOverlay>
      </CardHeader>
      <CardBody>
        <Box display="flex" flexDirection="row" gap="8px" mb="12px">
          {Array.isArray(type) ? (
            <>
              {type && type[0] && type[0].length > 20 ? (
                <>
                  <Tag style={{ pointerEvents: "none" }} key={type[0]}>
                    {type[0]}
                  </Tag>
                  {type.length > 1 && (
                    <Tooltip
                      hasArrow
                      shouldWrapChildren
                      placement="top"
                      label={type.slice(1).join(", ")}
                    >
                      <Tag variant="amount">+{type.length - 1}</Tag>
                    </Tooltip>
                  )}
                </>
              ) : (
                <>
                  {type.slice(0, 2).map((item: string) => (
                    <Tag style={{ pointerEvents: "none" }} key={item}>
                      {delegateNames?.[item] ?? item}
                    </Tag>
                  ))}
                  {type.length > 2 && (
                    <Tooltip
                      hasArrow
                      shouldWrapChildren
                      placement="top"
                      label={type.slice(2).join(", ")}
                    >
                      <Tag variant="amount">+{type.length - 2}</Tag>
                    </Tooltip>
                  )}
                </>
              )}
            </>
          ) : (
            <></>
          )}
        </Box>

        <MarkdownRenderer
          textProps={{ fontSize: "14px", noOfLines: 3, color: "#4A4A4F" }}
          content={formattedDelegateStatement || ""}
        />
      </CardBody>
      <CardFooter>
        <Box width="100%" display="flex" flexDirection="column" gap="16px">
          <Box>
            <Button
              size="condensed"
              variant="outline"
              onClick={onDelegateClick}
            >
              Delegate
            </Button>
          </Box>
        </Box>
      </CardFooter>
    </LinkBox>
  );
};
