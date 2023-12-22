import { Box, Flex, Icon, Skeleton, SystemStyleObject } from "@chakra-ui/react";
import React, { ReactNode } from "react";

import { Text } from "../Text";
import { Tag } from "../Tag";
import { Link } from "../Link";
import { truncateAddress } from "src/utils";
import { Heading } from "src/Heading";
import { format } from "date-fns";
import { CopyToClipboard } from "src/CopyToClipboard";
import {
  DiscordIcon,
  DiscourseIcon,
  GithubIcon,
  TwitterIcon,
  TelegramIcon,
} from "src/Icons";
import { Tooltip } from "src/Tooltip";
// import type { delegateTypeEnum } from '@yukilabs/governance-backend/src/db/schema/delegates';

type RootProps = {
  children?: ReactNode | undefined;
  direction?: "column" | "row";
  style?: SystemStyleObject;
};
const Root = ({ children, direction = "column", style }: RootProps) => {
  return (
    <Box
      display="flex"
      position="relative"
      rowGap={{ base: "12px" }}
      flexDirection={direction}
      flexWrap={direction === "row" ? "wrap" : "nowrap"}
      justifyContent="flex-start"
      sx={{ ...style }}
    >
      {children}
    </Box>
  );
};

type ItemProps = {
  label: string;
  value?: string | null | React.ReactNode;
  children?: React.ReactNode;
  isTruncated?: boolean;
  isCopiable?: boolean;
  isLoading?: boolean;
};

const Item = (props: ItemProps) => {
  const { label, isLoading, value, children, isTruncated, isCopiable } = props;
  if (isLoading) {
    return (
      <Flex justify="flex-start" gap="4px" alignItems="center">
        <Box width="50%">
          <Text variant="small" color="content.default.default">
            {label}
          </Text>
        </Box>
        <Skeleton height="14px" position="relative" top="4px" width="50%" />
      </Flex>
    );
  }
  const renderValue = () => {
    if (typeof value === "string") {
      return isCopiable ? (
        <CopyToClipboard text={value} iconSize="13px">
          <Text variant="small" color="content.accent.default">
            {isTruncated ? truncateAddress(value) : value}
          </Text>
        </CopyToClipboard>
      ) : (
        <Text variant="small" color="content.accent.default">
          {isTruncated ? truncateAddress(value) : value}
        </Text>
      );
    } else {
      return value; // If value is React.ReactNode, render it directly
    }
  };

  return (
    <Flex justify="flex-start" gap="4px">
      <Box width="50%">
        <Text variant="small" color="content.default.default">
          {label}
        </Text>
      </Box>
      <Box width="50%">{value ? renderValue() : children}</Box>
    </Flex>
  );
};

type LinkItemProps = {
  label: string;
  link?: string;
  linkLabel?: string | React.ReactNode;
  isExternal?: boolean;
  isLoading?: boolean;
};

const LinkItem = (props: LinkItemProps) => {
  const { label, isLoading, link, linkLabel, isExternal } = props;

  if (isLoading) {
    return (
      <Flex justify="flex-start" gap="4px">
        <Box width="50%">
          <Text variant="small" color="content.default.default">
            {label}
          </Text>
        </Box>
        <Skeleton height="14px" position="relative" top="4px" width="50%" />
      </Flex>
    );
  }

  return (
    <Flex justify="flex-start" gap="4px" alignItems="center">
      <Box width="50%">
        <Text variant="small" color="content.default.default">
          {label}
        </Text>
      </Box>
      <Box width="50%" height="20px">
        <Link
          variant="primary"
          size="small"
          href={link}
          isExternal={isExternal}
          padding="0"
          top="-4px"
          position="relative"
        >
          {linkLabel}
        </Link>
      </Box>
    </Flex>
  );
};

type TitleProps = {
  label?: string | null;
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
};

const Title = (props: TitleProps) => {
  const { label, size = "md" } = props;
  return (
    <Box width="full" pos="absolute" top="0px">
      <Heading
        variant="h4"
        size={size}
        fontWeight="500"
        color="#33333E"
        fontSize="16px"
      >
        {label}
      </Heading>
    </Box>
  );
};

type SocialsProps = {
  label?: "twitter" | "telegram" | "discord" | "discourse" | "github";
  value?: string | null;
  children?: React.ReactNode;
  isLoading?: boolean;
};

const platformBaseUrl = {
  twitter: "https://twitter.com/",
  github: "https://github.com/",
  discourse: "https://community.starknet.io/u/", // Replace with correct discourse URL
  discord: "https://discord.com/", // Replace with correct discord URL
  telegram: "https://t.me/",
};

const Socials = (props: SocialsProps) => {
  const { label = "twitter", isLoading, value, children } = props;
  const link = value ? `${platformBaseUrl[label]}${value}` : "";

  return (
    <Flex gap="8px" w={{ base: "48%" }} alignItems="center">
      <Icon
        as={
          label === "twitter"
            ? TwitterIcon
            : label === "github"
            ? GithubIcon
            : label === "discourse"
            ? DiscourseIcon
            : label === "discord"
            ? DiscordIcon
            : label === "telegram"
            ? TelegramIcon
            : TwitterIcon
        }
        w={"20px"}
        h={"20px"}
        color="#4A4A4F"
      />
      {isLoading ? (
        <Skeleton height="20px" width="80%" />
      ) : value ? (
        <Link
          href={link}
          isExternal
          fontWeight="500"
          fontSize="12px"
          letterSpacing={"0.12px"}
          hasArrow={false}
        >
          {value}
        </Link>
      ) : (
        children
      )}
    </Flex>
  );
};

type TagsProps = {
  type?: string | null;
};

const Tags = (props: TagsProps) => {
  const { type } = props;

  return (
    <Box>
      <Tag variant="neutral">{`${type}`}</Tag>
    </Box>
  );
};

type DateProps = {
  value: number | null;
  label: string;
};

const CustomDate = (props: DateProps) => {
  const { value, label } = props;
  let displayValue = "N/A";

  if (value !== null) {
    try {
      const timestamp: number = value < 10000000000 ? value * 1000 : value;
      const dateObject: Date = new Date(timestamp);
      displayValue = format(dateObject, "MMM dd, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
    }
  }

  return (
    <Flex justify="flex-start" gap="4px" alignItems="center">
      <Box width="50%">
        <Text variant="small" color="content.default.default">
          {label}
        </Text>
      </Box>
      <Box width="50%">
        <Text variant="small" color="content.accent.default">
          {displayValue}
        </Text>
      </Box>
    </Flex>
  );
};

type Strategy = {
  __typename: string;
  network: string;
  params: {
    symbol: string;
    address: string;
    decimals: number;
    delegationSpace: string;
  };
};

type StrategySummaryProps = {
  strategies: Strategy[];
};

const StrategySummary: React.FC<StrategySummaryProps> = ({ strategies }) => {
  return (
    <Flex justify="flex-start" gap="4px">
      <Box width="50%">
        <Text variant="small" color="content.default.default">
          Strategies
        </Text>
      </Box>
      <Box width="50%">
        <Flex>
          {strategies.map((strategy, index) => (
            <Tooltip
              key={index}
              label={`Address: ${strategy.params.address}\nDecimals: ${strategy.params.decimals}\nDelegation: ${strategy.params.delegationSpace}`}
              fontSize="md"
              placement="top"
              hasArrow
            >
              <Text variant="small" color="content.accent.default" mr={2}>
                {strategy.params.symbol}
              </Text>
            </Tooltip>
          ))}
        </Flex>
      </Box>
    </Flex>
  );
};

export {
  Root,
  Item,
  Title,
  Socials,
  Tags,
  CustomDate,
  LinkItem,
  StrategySummary,
};
