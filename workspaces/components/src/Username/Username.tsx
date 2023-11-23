import { Avatar, Box, Flex } from "@chakra-ui/react";
import { Text } from "../Text";
import { Heading } from "../Heading";
import { Indenticon } from "src/Indenticon";
import { Tooltip } from "src/Tooltip";
import { UserIcon } from "src/Icons/UiIcons";

type Props = {
  src?: string | null;
  displayName: string;
  size?: "condensed" | "standard";
  address: string;
  showTooltip?: boolean;
  tooltipContent?: string;
  isMemberType?: boolean;
};

export const Username = ({
  src,
  displayName,
  size = "condensed",
  address,
  showTooltip = false,
  isMemberType = false,
  tooltipContent = "",
}: Props) => {
  const renderDisplayName = () => {
    const content =
      size === "condensed" ? (
        <Text color="content.accent.default" variant="small">
          {displayName}
        </Text>
      ) : (
        <Heading color="content.default.default" variant="h5">
          {displayName}
        </Heading>
      );

    return showTooltip ? (
      <Tooltip
        hasArrow
        label={tooltipContent || displayName}
        aria-label="Display Name"
      >
        {content}
      </Tooltip>
    ) : (
      content
    );
  };

  if (isMemberType && address === "") {
    return (
      <Flex alignItems="center" gap="standard.xs">
        <Avatar
          size="sm"
          src={src === null ? "" : src}
          bg="#1A1523"
          icon={<UserIcon />}
        />
        {renderDisplayName()}
      </Flex>
    );
  }

  if (size === "condensed") {
    return (
      <Flex alignItems="center" gap="standard.base">
        <Box height="22px">
          {src !== null ? (
            <Avatar
              variant="withBorder"
              size="xs"
              src={src}
              bg="#1A1523"
              icon={<UserIcon />}
            />
          ) : (
            <Indenticon size={22} address={address?.toLowerCase()} />
          )}
        </Box>
        {renderDisplayName()}
      </Flex>
    );
  }
  return (
    <Flex alignItems="center" gap="standard.xs">
      {src !== null ? (
        <Avatar size="sm" src={src} bg="red" icon={<UserIcon />} />
      ) : (
        <Indenticon size={24} address={address?.toLowerCase()} />
      )}
      {renderDisplayName()}
    </Flex>
  );
};
