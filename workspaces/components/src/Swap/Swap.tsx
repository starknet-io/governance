import { Box, Flex, Icon, Skeleton } from "@chakra-ui/react";
import * as ProfileSummaryCard from "../ProfileSummaryCard/ProfileSummaryCard";
import { Text } from "src/Text";
import { Heading } from "src/Heading";
import { ArrowDownIcon, InfoCircleIcon } from "src/Icons";
import { Button } from "src/Button";
import { Tooltip } from "src/Tooltip";
import { navigate } from "vite-plugin-ssr/client/router";

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
  onClick,
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
        ...sx,
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
          <ProfileSummaryCard.Root>
            <ProfileSummaryCard.Profile
              size="xs"
              ensName={ethAddress}
              address={shortAddress(address)}
              avatarString={address}
              text={text}
            ></ProfileSummaryCard.Profile>
          </ProfileSummaryCard.Root>
        </Flex>
        <Flex flexDirection={"column"} alignItems="flex-end" gap="2px">
          <Text
            color="content.support.default"
            variant="small"
            as="span"
          >
            {isSender && "Available balance"}
            {isReceiver && !isSender && "Voting power"}
          </Text>
          {!balance ? <Skeleton height="14px" width="40%" mt="4px" /> :
          <Text variant="mediumStrong" color="content.default.default">
            {balance} {symbol}
          </Text>}
        </Flex>
      </Flex>
      {text === "Starknet Mainnet" ? <Flex
        alignItems="center"
        gap="standard.xs"
        alignSelf="stretch"
        padding="standard.md"
        pt="0"
      >
        <Text
          variant="bodySmallStrong"
          color="content.accent.default"
          sx={{
            flex: "1 0 0",
            textWrap: "wrap",
            textAlign: "left",
            fontWeight: 500,
          }}
        >
        You must stake STRK for vSTRK in order to delegate <Tooltip label="Tooltip" aria-label="Tooltip Text"><Box
          sx={{
            display: "inline-block",
            width: "14px",
            height: "14px",
            verticalAlign: "text-top",
            "& svg": {
              width: "14px",
              height: "14px",
              verticalAlign: "top"
            }
          }}><InfoCircleIcon /></Box></Tooltip>
        </Text>
        <Button
          variant="primary"
          size="condensed"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            navigate('/manage-vstrk')
          }}
        >Manage vSTRK</Button>
      </Flex>: null}
    </Button>
  );
};

const Arrow = ({ py = "standard.sm" }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      py={py}
    >
      <Icon as={ArrowDownIcon} color="#6C6C75" boxSize="24px" />
    </Box>
  );
};

export { Root, UserSummary, Arrow };
