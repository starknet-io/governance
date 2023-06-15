import { Box, Flex, Icon } from "@chakra-ui/react";
import * as ProfileSummaryCard from "../ProfileSummaryCard/ProfileSummaryCard";
import React from "react";
import { MdArrowDownward } from "react-icons/md";
import { Text } from "src/Text";

type Props = {
  children: React.ReactNode;
};

const Root = ({ children }: Props) => {
  return <Flex flexDirection="column">{children}</Flex>;
};

type UserSummaryProps = {
  address?: string | null;
  ethAddress?: string | null;
  avatarString?: string | null;
  balance?: string | null;
};
const UserSummary = ({
  address = "0x23423423423423423423423432",
  ethAddress = "robwalsh.eth",
  balance = "100,000",
}: UserSummaryProps) => {
  return (
    <Box
      fontSize="14px"
      bg="#FAFAFA"
      p="16px"
      border="1px solid #E4E5E7"
      borderRadius="8px"
      color="#6C6C75"
      display="flex"
      justifyContent="space-between"
    >
      <Flex flexDirection="column" gap="8px">
        <Text color="#6C6C75" as="span">
          From
        </Text>
        <ProfileSummaryCard.Root>
          <ProfileSummaryCard.Profile
            size="xs"
            ethAddress={ethAddress}
            avatarString={address}
          ></ProfileSummaryCard.Profile>
        </ProfileSummaryCard.Root>
      </Flex>
      <Flex flexDirection={"column"} alignItems="flex-end" gap="10px">
        <Text color="#6C6C75" as="span">
          Available Balance
        </Text>
        <Text color="#292932" fontSize="16px">
          {balance} STRK
        </Text>
      </Flex>
    </Box>
  );
};

const Arrow = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      py="11px"
    >
      <Icon as={MdArrowDownward} color="#6C6C75" boxSize="24px" />
    </Box>
  );
};

export { Root, UserSummary, Arrow };
