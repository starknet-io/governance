import { Box, Flex, Icon } from "@chakra-ui/react";
import * as ProfileSummaryCard from "../ProfileSummaryCard/ProfileSummaryCard";
import { Text } from "src/Text";
import { ArrowDownIcon } from "src/Icons";

type Props = {
  children: React.ReactNode;
};

const Root = ({ children }: Props) => {
  return <Flex flexDirection="column">{children}</Flex>;
};

const shortAddress = (address: string | null) => {
  if (address) return address.slice(0, 3) + "..." + address.slice(-3);
  return "test.eth";
};

type UserSummaryProps = {
  address?: string | null;
  ethAddress?: string | null;
  avatarString?: string | null;
  balance?: string | null;
  text?: string | null;
  symbol?: string;
};
const UserSummary = ({
  address = "0x23423423423423423423423432",
  ethAddress,
  balance = "100,000",
  text = "From",
  symbol = "STRK",
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
          {text}
        </Text>
        <ProfileSummaryCard.Root>
          <ProfileSummaryCard.Profile
            size="xs"
            ensName={ethAddress}
            address={shortAddress(address)}
            avatarString={address}
          ></ProfileSummaryCard.Profile>
        </ProfileSummaryCard.Root>
      </Flex>
      <Flex flexDirection={"column"} alignItems="flex-end" gap="10px">
        <Text color="#6C6C75" as="span">
          Available Balance
        </Text>
        <Text color="#292932" fontSize="16px">
          {balance} {symbol}
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
      <Icon as={ArrowDownIcon} color="#6C6C75" boxSize="24px" />
    </Box>
  );
};

export { Root, UserSummary, Arrow };
