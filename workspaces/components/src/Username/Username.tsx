import { Avatar, Box, Flex } from "@chakra-ui/react";
import { Text } from "../Text";
import { Heading } from "../Heading";
import { Indenticon } from "src/Indenticon";
import { Tooltip } from "src/Tooltip";

type Props = {
  src?: string | null;
  displayName: string;
  size?: "condensed" | "standard";
  address: string;
  showTooltip?: boolean;
  tooltipContent?: string;
};

export const Username = ({
  src,
  displayName,
  size = "condensed",
  address,
  showTooltip = false,
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

  if (size === "condensed") {
    return (
      <Flex alignItems="center" gap="standard.base">
        <Box height="22px">
          {src !== null ? (
            <Avatar variant="withBorder" size="xs" src={src} />
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
        <Avatar size="sm" src={src} />
      ) : (
        <Indenticon size={24} address={address?.toLowerCase()} />
      )}
      {renderDisplayName()}
    </Flex>
  );
};
