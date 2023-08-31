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

import { Text } from "../Text";
import { Tag } from "../Tag";
import { Button } from "../Button";
import * as ProfileSummaryCard from "src/ProfileSummaryCard/ProfileSummaryCard";
import { MarkdownRenderer } from "src/MarkdownRenderer";

type Props = {
  delegateType: string[] | null;
  delegateStatement: string;
  avatarUrl?: string | null;
  ensName?: string | null;
  address?: string | null;
  delegatedVotes?: string;
  onDelegateClick?: () => void;
  profileURL?: string;
};

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

export const DelegateCard = (props: Props) => {
  const {
    onDelegateClick,
    profileURL,
    delegatedVotes = "0",
    address,
    delegateType,
    delegateStatement,
    ensName,
    avatarUrl,
  } = props;
  const delegatedVotesFormatted = `${delegatedVotes} Votes`;

  return (
    <LinkBox as={Card} variant="outline">
      <CardHeader>
        <LinkOverlay href={profileURL}>
          <ProfileSummaryCard.Root>
            <ProfileSummaryCard.Profile
              imgUrl={avatarUrl}
              size="sm"
              address={address}
              ensName={ensName}
              subtitle={delegatedVotesFormatted.toUpperCase()}
              avatarString={address}
            ></ProfileSummaryCard.Profile>
          </ProfileSummaryCard.Root>
        </LinkOverlay>
      </CardHeader>
      <CardBody>
        <Box display="flex" flexDirection="row" gap="8px" mb="12px">
          {Array.isArray(delegateType) ? (
            <>
              {delegateType[0].length > 20 ? (
                <>
                  <Tag variant="listCard" key={delegateType[0]}>
                    {delegateType[0]}
                  </Tag>
                  {delegateType.length > 1 && (
                    <Tooltip
                      hasArrow
                      shouldWrapChildren
                      placement="top"
                      label={delegateType.slice(1).join(", ")}
                    >
                      <Tag variant="listCard">+{delegateType.length - 1}</Tag>
                    </Tooltip>
                  )}
                </>
              ) : (
                <>
                  {delegateType.slice(0, 2).map((item: string) => (
                    <Tag variant="listCard" key={item}>
                      {delegateNames?.[item] ?? item}
                    </Tag>
                  ))}
                  {delegateType.length > 2 && (
                    <Tooltip
                      hasArrow
                      shouldWrapChildren
                      placement="top"
                      label={delegateType.slice(2).join(", ")}
                    >
                      <Tag variant="listCard">+{delegateType.length - 2}</Tag>
                    </Tooltip>
                  )}
                </>
              )}
            </>
          ) : (
            <></>
          )}
        </Box>
        <Text fontSize="13px" noOfLines={3} color="#6B6B80">
          <MarkdownRenderer content={delegateStatement || ""} />
        </Text>
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
