import {
  Avatar,
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { Heading } from "..//Heading";
import { IconButton } from "..//IconButton";
import { Indenticon } from "../Indenticon";
import { Text } from "../Text";
import { truncateAddress } from "..//utils";
import { Button } from "..//Button";
import { EllipsisIcon } from "..//Icons";

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
};
const Profile = ({
  imgUrl,
  address,
  subtitle,
  children,
  avatarString,
  size = "lg",
  ensName,
}: ProfileProps) => {
  const formattedAddress = ensName || (address && truncateAddress(address));

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={size === "lg" ? "16px" : size === "xs" ? "standard.sm" : "16px"}
    >
      {imgUrl ? (
        // debug next line
        // <Avatar size={size === "lg" ? "lg" || size ==="xs" ? "sm" : "md"} ../={imgUrl} />

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
        <Heading
          variant="h5"
          fontSize={size === "lg" ? "20px" : "14px"}
          color="content.accent.default"
          lineHeight={size === "lg" ? "24px" : "20px"}
        >
          {formattedAddress}
        </Heading>
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
