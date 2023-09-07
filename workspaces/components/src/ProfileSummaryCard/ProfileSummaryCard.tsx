import {
  Avatar,
  Box,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Flex,
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
  subtitle?: string | null;
  votingPower?: number | null;
  children?: React.ReactNode;
  size?: "xs" | "sm" | "lg";
  avatarString?: string | null;
  ensName?: string | null;
};
const Profile = ({
  imgUrl,
  address,
  subtitle,
  votingPower,
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
      <Stack spacing="4px" gap={1}>
        <Heading
          variant="h3"
          fontSize={size === "lg" ? "20px" : "16px"}
          color="#1A1523"
        >
          {formattedAddress}
        </Heading>
        <Stack gap={1}>
          <Text
            variant="breadcrumbs"
            fontSize="10px"
            color="#4A4A4F"
            fontWeight="600"
          >
            {address && subtitle === null ? formattedAddress : subtitle}
          </Text>
          {votingPower ? (
            <Text
              variant="breadcrumbs"
              fontSize="10px"
              color="#4A4A4F"
              fontWeight="600"
            >
              {`  ${votingPower} Voting Power`}
            </Text>
          ) : null}
        </Stack>
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
    <Button onClick={onClick} variant="primary">
      {label}
    </Button>
  );
};

export { Root, Profile, MoreActions, PrimaryButton };
