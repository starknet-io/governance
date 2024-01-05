import { Avatar, Box, Flex, Menu, MenuItem } from "@chakra-ui/react";
import { Text } from "../Text";
import { Indenticon } from "../Indenticon";
import { Heading } from "../Heading";
import { Dropdown } from "../Dropdown";
import { EllipsisIcon } from "../Icons";
import { Tooltip } from "../Tooltip";
import { truncateAddress } from "../utils";
import { CopyToClipboard } from "../CopyToClipboard";

type Props = {
  size?: "condensed" | "standard";
  headerText?: string | null;
  subheaderText?: string | null;
  address?: string | null;
  src?: string | null;
  dropdownChildren?: React.ReactNode;
  headerTooltipContent?: string; // Tooltip for headerText
  subheaderTooltipContent?: string; // Tooltip for subheaderText
  withCopy?: boolean;
};

export const AvatarWithText = ({
  size,
  withCopy,
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
      <>
        <Tooltip label={headerTooltipContent} aria-label="Header Text">
          {content}
        </Tooltip>
        {withCopy && !subheaderText && (
          <Flex alignItems="center" gap={0.5}>
            <CopyToClipboard noPadding text={address || ""} />
            <Text as="span" color="content.default.default" variant="small">
              Copy
            </Text>
          </Flex>
        )}
      </>
    ) : (
      content
    );
  };

  const renderSubheaderText = () => {
    // If the headerText is showing the truncated address and subheaderText is also an address, don't show the subheaderText.
    if (
      headerText?.toLowerCase() ===
        truncateAddress(address || "").toLowerCase() &&
      subheaderText?.toLowerCase() ===
        truncateAddress(address || "").toLowerCase()
    ) {
      return null;
    }

    const content =
      size === "condensed" ? (
        <Text
          as="span"
          lineHeight="10px"
          color="content.support.default"
          variant="captionSmallUppercase"
          pb="standard.base"
        >
          {subheaderText}
        </Text>
      ) : (
        <Text as="span" color="content.default.default" variant="small">
          {subheaderText}
        </Text>
      );

    return subheaderTooltipContent ? (
      withCopy ? (
        <Box as="span">
          <CopyToClipboard text={subheaderTooltipContent} iconSize="12px">
            <Tooltip
              shouldWrapChildren={false}
              label={subheaderTooltipContent}
              aria-label="Subheader Text"
            >
              {content}
            </Tooltip>
          </CopyToClipboard>
        </Box>
      ) : (
        <Box as="span">
          <Tooltip label={subheaderTooltipContent} aria-label="Subheader Text">
            {content}
          </Tooltip>
        </Box>
      )
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
        <Box
          position="relative"
          flexDirection={"column"}
          justifyContent={"center"}
          flex={1}
          gap="0"
        >
          <Box height="24px">{renderHeaderText()}</Box>
          <Box mt="-4px">{renderSubheaderText()}</Box>
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

export default AvatarWithText;
