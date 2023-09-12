import { Box, Flex, Icon, Link } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { BsDiscord, BsGithub, BsTelegram, BsTwitter } from "react-icons/bs";

import { Text } from "../Text";
import { Tag } from "../Tag";
import { truncateAddress } from "src/utils";
import { Heading } from "src/Heading";
import moment from "moment";
import { CopyToClipboard } from "src/CopyToClipboard";
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
      rowGap={{ base: "16px" }}
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
};

const Item = (props: ItemProps) => {
  const { label, value, children, isTruncated, isCopiable } = props;

  const renderValue = () => {
    if (typeof value === "string") {
      return isCopiable ? (
        <CopyToClipboard text={value}>
          <Text variant="small" color="content.accent.default" title={value}>
            {isTruncated ? truncateAddress(value) : value}
          </Text>
        </CopyToClipboard>
      ) : (
        <Text variant="small" color="content.accent.default" title={value}>
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
};

const platformBaseUrl = {
  twitter: "https://twitter.com/",
  github: "https://github.com/",
  discourse: "https://discourse.org/", // Replace with correct discourse URL
  discord: "https://discord.com/", // Replace with correct discord URL
  telegram: "https://t.me/",
};

const Socials = (props: SocialsProps) => {
  const { label = "twitter", value, children } = props;
  const link = value ? `${platformBaseUrl[label]}${value}` : "";

  return (
    <Flex gap="8px" w={{ base: "48%" }} alignItems="center">
      <Icon
        as={
          label === "twitter"
            ? BsTwitter
            : label === "github"
            ? BsGithub
            : label === "discourse"
            ? BsDiscord
            : label === "discord"
            ? BsDiscord
            : label === "telegram"
            ? BsTelegram
            : BsTwitter
        }
        w={"16px"}
        h={"16px"}
        color="gray.600"
      />
      {value ? (
        <Link href={link} isExternal fontSize="sm" fontWeight="medium">
          {value}
        </Link>
      ) : (
        children
      )}
    </Flex>
  );
};
// can't seem to use the exported DelegateTypeEnum from the governance-backend package
// export enum DelegateTypeEnum {
//   CairoDev = 'Cairo Dev',
//   DAOs = 'DAOs',
//   Governance = 'Governance',
//   Identity = 'Identity',
//   InfrastructureStarknetDev = 'Infrastructure Starknet Dev',
//   Legal = 'Legal',
//   NFT = 'NFT',
//   ProfessionalDelegates = 'Professional Delegates',
//   Security = 'Security',
//   StarknetCommunity = 'Starknet Community',
//   Web3Community = 'Web3 Community',
//   Web3Developer = 'Web3 Developer',
// }
type TagsProps = {
  type?: string | null;
};

const Tags = (props: TagsProps) => {
  const { type } = props;

  return (
    <Box>
      <Tag variant="review">{`${type}`}</Tag>
    </Box>
  );
};

type DateProps = {
  value: number | null;
  label: string;
};

const Date = (props: DateProps) => {
  const { value, label } = props;
  let displayValue = "N/A";

  if (value !== null) {
    const timestamp = value < 10000000000 ? value * 1000 : value;
    displayValue = moment(timestamp).format("MMM DD, YYYY");
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

export { Root, Item, Title, Socials, Tags, Date };
