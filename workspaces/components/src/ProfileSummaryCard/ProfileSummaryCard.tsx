import {
  Avatar,
  Box,
  Menu,
  MenuButton,
  MenuList,
  Stack,
} from "@chakra-ui/react";
import { Heading } from "src/Heading";
import { IconButton } from "src/IconButton";
import { Indenticon } from "../Indenticon";
import { Text } from "../Text";
import { truncateAddress } from "src/utils";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import { Button } from "src/Button";

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
  ethAddress?: string | null;
  subtitle?: string | null;
  children?: React.ReactNode;
  size?: "xs" | "sm" | "lg";
  avatarString?: string | null;
};
const Profile = ({
  imgUrl,
  address,
  ethAddress,
  subtitle,
  children,
  avatarString,
  size = "lg",
}: ProfileProps) => {
  const formattedAddress = address && truncateAddress(address);

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={size === "lg" ? "16px" : size === "xs" ? "8px" : "16px"}
    >
      {imgUrl ? (
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
      <Stack spacing="4px">
        <Heading
          variant="h3"
          fontSize={size === "lg" ? "20px" : "16px"}
          color="#33333E"
        >
          {ethAddress ? ethAddress : formattedAddress}
        </Heading>
        <Text variant="breadcrumbs" fontSize="12px" color="#6C6C75">
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
        <MenuButton
          as={IconButton}
          icon={<HiEllipsisHorizontal size="32px" />}
          variant="icon"
        />

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
};
const PrimaryButton = ({ onClick, label = "button" }: PrimaryButtonProps) => {
  return (
    <Button onClick={onClick} variant="solid">
      {label}
    </Button>
  );
};

export { Root, Profile, MoreActions, PrimaryButton };
