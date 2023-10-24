import { Avatar, Box, Flex, Menu, MenuItem } from "@chakra-ui/react";
import { Text } from "src/Text";
import { Indenticon } from "src/Indenticon";
import { Heading } from "src/Heading";
import { Dropdown } from "src/Dropdown";
import { EllipsisIcon } from "src/Icons";
import { Tooltip } from "src/Tooltip";

type Props = {
  size?: "condensed" | "standard";
  headerText?: string | null;
  subheaderText?: string | null;
  address?: string | null;
  src?: string | null;
  dropdownChildren?: React.ReactNode;
  headerTooltipContent?: string; // Tooltip for headerText
  subheaderTooltipContent?: string; // Tooltip for subheaderText
};

export const AvatarWithText = ({
  size,
  headerText,
  subheaderText,
  address,
  src,
  dropdownChildren,
  headerTooltipContent,
  subheaderTooltipContent,
}: Props) => {
  const renderHeaderText = () => {
    const content = (
      <Heading
        color="content.accent.default"
        lineHeight="24px"
        variant={size === "condensed" ? "h4" : "h3"}
        mb="standard.2xs"
        width={size === "condensed" ? undefined : { base: "100%", lg: "80%" }}
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {headerText}
      </Heading>
    );

    return headerTooltipContent ? (
      <Tooltip
        left="-40px"
        shouldWrapChildren
        placement="top"
        hasArrow
        label={headerTooltipContent}
        aria-label="Header Text"
      >
        {content}
      </Tooltip>
    ) : (
      content
    );
  };

  const renderSubheaderText = () => {
    const content =
      size === "condensed" ? (
        <Text
          lineHeight="10px"
          color="content.support.default"
          variant="captionSmallUppercase"
          pb="standard.base"
        >
          {subheaderText}
        </Text>
      ) : (
        <Text color="content.default.default" variant="small">
          {subheaderText}
        </Text>
      );

    return subheaderTooltipContent ? (
      <Tooltip
        left="-80px"
        shouldWrapChildren
        placement="top"
        hasArrow
        label={subheaderTooltipContent}
        aria-label="Subheader Text"
      >
        {content}
      </Tooltip>
    ) : (
      content
    );
  };

  if (size === "condensed") {
    return (
      <Flex gap="standard.sm" alignItems="center">
        <Box>
          {src !== null ? (
            <Avatar size="lg" src={src} />
          ) : (
            <Indenticon size={48} address={address} />
          )}
        </Box>
        <Box position="relative">
          {renderHeaderText()}
          {renderSubheaderText()}
        </Box>
      </Flex>
    );
  }

  return (
    <Flex
      gap="standard.sm"
      alignItems="center"
      position={"relative"}
      overflow="hidden"
    >
      <Box>
        {src !== null ? (
          <Avatar variant="withBorder" size="xlg" src={src} />
        ) : (
          <Indenticon size={66} address={address} />
        )}
      </Box>

      <Flex flexDirection={"column"} justifyContent={"center"} flex={1}>
        {renderHeaderText()}
        {renderSubheaderText()}
      </Flex>

      <Box width="44px" height="44px" position="absolute" top="0" right="0">
        {dropdownChildren === null ? null : (
          <Dropdown buttonIcon={<EllipsisIcon boxSize="20px" />}>
            {dropdownChildren}
          </Dropdown>
        )}
      </Box>
    </Flex>
  );
};
