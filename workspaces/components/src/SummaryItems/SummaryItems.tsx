import { Box, Flex, Icon, Link, Skeleton, Tooltip } from "@chakra-ui/react";
import React, { ReactNode } from "react";

import { Text } from "../Text";
import { Tag } from "../Tag";
import { truncateAddress } from "src/utils";
import { Heading } from "src/Heading";
import { format } from "date-fns";
import { CopyToClipboard } from "src/CopyToClipboard";
import { DiscordIcon, DiscourseIcon, GithubIcon, TwitterIcon } from "src/Icons";
// import type { delegateTypeEnum } from '@yukilabs/governance-backend/src/db/schema/delegates';

type RootProps = {
  children?: ReactNode | undefined;
  direction?: "column" | "row";
};
const Root = ({ children, direction = "column" }: RootProps) => {
  return (
    <Box
      display="flex"
      position="relative"
      rowGap={{ base: "12px" }}
      flexDirection={direction}
      flexWrap={direction === "row" ? "wrap" : "nowrap"}
      justifyContent="flex-start"
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
      {value ? renderValue() : children}
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
  discourse: "https://discourse.org/", // Replace with correct discourse URL
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
            ? DiscourseIcon
            : TwitterIcon
        }
        w={"16px"}
        h={"16px"}
        color="gray.600"
      />
      {isLoading ? (
        <Skeleton height="20px" width="80%" />
      ) : value ? (
        <Link href={link} isExternal fontSize="sm" fontWeight="medium">
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
    const timestamp: number = value < 10000000000 ? value * 1000 : value;
    //ts-expect-error
    const dateObject: Date = new Date(timestamp);
    displayValue = format(dateObject, "MMM dd, yyyy");
  }

  return (
    <Flex justify="space-between" fontSize="sm">
      <Text fontWeight="medium" color="#6C6C75">
        {label}
      </Text>
      <Text color="#292932" fontWeight="medium">
        {displayValue}
      </Text>
    </Flex>
  );
};

export { Root, Item, Title, Socials, Tags, CustomDate };
