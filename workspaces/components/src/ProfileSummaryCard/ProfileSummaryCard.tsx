import {
  Avatar,
  Box,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { Heading } from "src/Heading";
import { IconButton } from "src/IconButton";
import { Indenticon } from "../Indenticon";
import { Text } from "../Text";
import { truncateAddress } from "src/utils";
import { Button } from "src/Button";
import { EllipsisIcon, EthereumIcon, StarknetIcon } from "src/Icons";
import { Logo } from "src/Logo";

type RootProps = {
  children: React.ReactNode;
};
const Root = ({ children }: RootProps) => {
  return (
    <Stack spacing="24px" direction={{ base: "column" }}>
      {children}
    </Stack>
  );
};

type ProfileProps = {
  imgUrl?: string | null;
  address?: string | null | undefined;
  subtitle?: string | null;
  children?: React.ReactNode;
  size?: "xs" | "sm" | "lg";
  avatarString?: string | null;
  ensName?: string | null;
  text?: string | null;
};
const Profile = ({
  imgUrl,
  address,
  subtitle,
  children,
  avatarString,
  size = "lg",
  ensName,
  text,
}: ProfileProps) => {
  const formattedAddress = ensName || (address && truncateAddress(address));

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={size === "lg" ? "16px" : size === "xs" ? "standard.sm" : "16px"}
    >
      {text && text === "Ethereum" ? (
        <Icon as={EthereumIcon} width="32px" height="32px" />
      ) : text === "Starknet" ? (
        <Icon as={StarknetIcon} width="32px" height="32px" />
      ) : imgUrl ? (
        // debug next line
        // <Avatar size={size === "lg" ? "lg" || size ==="xs" ? "sm" : "md"} src={imgUrl} />

        <Avatar
          size={size === "lg" ? "lg" : size === "xs" ? "sm" : "md"}
          src={imgUrl}
        />
      ) : (
        <Indenticon
          size={size === "lg" ? 64 : size === "xs" ? 32 : 48}
          address={avatarString}
        />
      )}
      <Stack spacing={size === "lg" ? "4px" : "2px"}>
        <Text
          color="content.suport.default"
          variant="small"
          as="span"
          textAlign="left"
        >
          {text}
        </Text>
        <Text
          variant="mediumStrong"
          fontSize={size === "lg" ? "20px" : "14px"}
          color="content.default.default"
          lineHeight={size === "lg" ? "24px" : "20px"}
          textAlign="left"
        >
          {formattedAddress}
        </Text>
        <Text
          variant="captionSmallUppercase"
          color="content.support.default"
          fontWeight="600"
          letterSpacing="0.5px"
        >
          {address && subtitle === null ? formattedAddress : subtitle}
        </Text>
      </Stack>
      <Box marginLeft="auto">{children}</Box>
    </Box>
  );
};
type MoreActionsProps = {
  children: React.ReactNode;
};
const MoreActions = ({ children }: MoreActionsProps) => {
  return (
    <Box style={{ position: "relative" }}>
      <Menu>
        <MenuButton as={IconButton} icon={<EllipsisIcon />} variant="ghost" />

        <Box top="0px" position="relative">
          <MenuList>{children}</MenuList>
        </Box>
      </Menu>
    </Box>
  );
};
type PrimaryButtonProps = {
  onClick: () => void;
  label: string;
  isLoading?: boolean;
};
const PrimaryButton = ({
  onClick,
  label = "button",
  isLoading,
}: PrimaryButtonProps) => {
  return (
    <Button onClick={onClick} variant="primary">
      {isLoading ? (
        <Flex gap={1.5} align="center">
          <Spinner size="sm" />
          <Text variant="mediumStrong">{label}</Text>
        </Flex>
      ) : (
        <>{label}</>
      )}
    </Button>
  );
};

export { Root, Profile, MoreActions, PrimaryButton };
