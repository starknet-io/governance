import { Box, Flex, Icon } from "@chakra-ui/react";
import * as ProfileSummaryCard from "../ProfileSummaryCard/ProfileSummaryCard";
import { Text } from "src/Text";
import { Heading } from "src/Heading";
import { ArrowDownIcon } from "src/Icons";
import { Button } from "src/Button";

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
  isSender?: boolean;
  isReceiver?: boolean;
  isSelected?: boolean;
  sx?: any;
  onClick?: () => void;
};
const UserSummary = ({
  address = "0x23423423423423423423423432",
  isSender,
  isReceiver,
  ethAddress,
  balance = "100,000",
  text = "From",
  symbol = "STRK",
  isSelected = false,
  sx,
  onClick
}: UserSummaryProps) => {
  return (
    <Button
      variant="fill"
      isActive={isSelected}
      boxShadow="0px 1px 2px 0px rgba(0, 0, 0, 0.04)"
      border="1px solid"
      borderColor="border.forms"
      borderRadius="8px"
      bg="surface.forms.default"
      onClick={onClick}
      sx={{
        padding: 0,
        width: "100%",
        ...sx
      }}
    >
      <Flex
        fontSize="14px"
        p="standard.md"
        color="#6C6C75"
        display="flex"
        justifyContent="space-between"
        width="100%"
      >
        <Flex flexDirection="column" gap="standard.2xs">
          <Text color="content.default.default" variant="bodyMediumStrong" as="span">
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
        <Flex flexDirection={"column"} alignItems="flex-end" gap="standard.xs">
          <Text color="content.default.default" variant="bodyMediumStrong" as="span">
            {isSender && "Available votes"}
            {isReceiver && !isSender && "Delegated votes"}
          </Text>
          <Heading
            variant="h5">
            {balance} {symbol}
          </Heading>
        </Flex>
      </Flex>
    </Button>
  );
};

const Arrow = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      py="standard.xl"
    >
      <Icon as={ArrowDownIcon} color="#6C6C75" boxSize="24px" />
    </Box>
  );
};

export { Root, UserSummary, Arrow };
