import { Box, Flex, Icon } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { BsDiscord, BsGithub, BsTelegram, BsTwitter } from "react-icons/bs";

import { Text } from "../Text";
import { Tag } from "../Tag";
import { truncateAddress } from "src/utils";
// import type { delegateTypeEnum } from '@yukilabs/governance-backend/src/db/schema/delegates';

type RootProps = {
  children?: ReactNode | undefined;
  direction?: "column" | "row";
};
const Root = ({ children, direction = "column" }: RootProps) => {
  return (
    <Box
      my="32px"
      pt="40px"
      display="flex"
      position="relative"
      rowGap={{ base: "16px" }}
      flexDirection={direction}
      flexWrap={direction === "row" ? "wrap" : "nowrap"}
      justifyContent="flex-start"
      color="#6C6C75"
    >
      {children}
    </Box>
  );
};

type ItemProps = {
  label: string;
  value?: string | null;
  children?: React.ReactNode;
  isTruncated?: boolean;
};

const Item = (props: ItemProps) => {
  const { label, value, children, isTruncated } = props;
  return (
    <Flex justify="space-between" fontSize="sm">
      <Text fontWeight="medium" color="gray.600">
        {label}
      </Text>
      {value ? (
        <Text color="#292932" fontWeight="medium" title={value}>
          {isTruncated ? truncateAddress(value) : value}
        </Text>
      ) : (
        children
      )}
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
      <Text size={size} fontWeight="medium" color="gray.600">
        {label}
      </Text>
    </Box>
  );
};

type SocialsProps = {
  label?: "twitter" | "telegram" | "discord" | "discourse" | "github";
  value?: string | null;
  children?: React.ReactNode;
};

const Socials = (props: SocialsProps) => {
  const { label = "twitter", value, children } = props;

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
        <Text fontSize="sm" fontWeight="medium">
          {value}
        </Text>
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
      <Tag size="lg" variant="primary">
        {`${type}`}
      </Tag>
    </Box>
  );
};

export { Root, Item, Title, Socials, Tags };
