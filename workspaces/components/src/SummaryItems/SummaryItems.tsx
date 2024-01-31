import { Box, Flex, Icon, Skeleton, SystemStyleObject, useDisclosure } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { IconButton } from "../IconButton";
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
      width="100%"
      sx={{ ...style }}
    >
      {children}
    </Box>
  );
};

type ItemProps = {
  label: string;
  value?: string | null | React.ReactNode;
  additionalValue?: string | null | React.ReactNode;
  children?: React.ReactNode;
  isTruncated?: boolean;
  isCopiable?: boolean;
  isLoading?: boolean;
  isExtendable?: boolean;
};

const Item = (props: ItemProps) => {
  const { label, isLoading, value, children, isTruncated, isCopiable, isExtendable, additionalValue } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  if (isLoading) {
    return (
      <Flex justify="flex-start" gap="4px" alignItems="center">
        <Flex width="50%" justifyContent="center" alignItems="flex-start" direction="column">
          <Text variant="small" color="content.default.default">
            {label}
          </Text>
          {isExtendable && isOpen ? <Box>
            <svg width="19" height="11" viewBox="0 0 19 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path id="Rectangle 5597" d="M1 0V2C1 6.41828 4.58172 10 9 10H19" stroke="#DCDBDD"/>
            </svg>Voting power
          </Box> : null}
        </Flex>
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
      <Flex width="50%" justifyContent="center" alignItems="flex-start" direction="column">
        <Text variant="small" color="content.default.default">
          {label}
        </Text>
        {isExtendable && isOpen ? <Flex direction="row" mt="5px">
            <svg width="19" height="11" viewBox="0 0 19 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path id="Rectangle 5597" d="M1 0V2C1 6.41828 4.58172 10 9 10H19" stroke="#DCDBDD"/>
            </svg> <Text variant="small" color="content.default.default" ml="4px">
          Voting power
        </Text>
          </Flex> : null}
      </Flex>
      <Flex width="50%" direction="column">
        <Flex direction="row" justifyContent="space-between" gap="standard.base">
          {value ? renderValue() : children} {isExtendable && additionalValue ? <IconButton
            aria-label="close"
            onClick={() => isOpen ? onClose() : onOpen()}
            color="#4A4A4F"
            variant="ghost"
            size="xs"
            width="20px"
            height="20px"
            sx={{
              borderRadius: "standard.base",
              border: "1px solid rgba(35, 25, 45, 0.10)",
              transform: isOpen ? "none" : "rotate(180deg)"
            }}
            icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="wrapper">
                <path id="Union" fillRule="evenodd" clipRule="evenodd" d="M8.53033 4.96967C8.23744 4.67678 7.76256 4.67678 7.46967 4.96967L2.46967 9.96967C2.17678 10.2626 2.17678 10.7374 2.46967 11.0303C2.76256 11.3232 3.23744 11.3232 3.53033 11.0303L8 6.56066L12.4697 11.0303C12.7626 11.3232 13.2374 11.3232 13.5303 11.0303C13.8232 10.7374 13.8232 10.2626 13.5303 9.96967L8.53033 4.96967Z" fill="#86848D"/>
                </g>
              </svg>
            }
          /> : null}
        </Flex>
        {additionalValue && isOpen ? <Text variant="small" color="content.accent.default" mt="5px">
          {additionalValue}
        </Text> : null}
      </Flex>
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
    <Flex gap="8px" alignItems="center" width="25%">
      {isLoading ? (
        <Skeleton height="20px" width="70%" />
      ) : value ? (
        <Link
          href={link}
          isExternal
          fontWeight="500"
          fontSize="12px"
          letterSpacing={"0.12px"}
          hasArrow={false}
          sx={{
            _hover: {
              textDecoration: "none"
            }
          }}
        >
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
