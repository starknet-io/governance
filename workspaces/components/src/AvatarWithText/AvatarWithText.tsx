import { useEffect, useRef, useState } from "react";
import { Avatar, Box, Flex } from "@chakra-ui/react";
import { Text } from "src/Text";
import { Indenticon } from "src/Indenticon";
import { Heading } from "src/Heading";
import { Dropdown } from "src/Dropdown";
import { EllipsisIcon } from "src/Icons";
import { Tooltip } from "src/Tooltip";
import { Badge } from "src/Badge";
import { truncateAddress } from "src/utils";
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
  status?: string | null;
  delegateProfile?: boolean;
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
  status,
  delegateProfile = false,
}: Props) => {

  const headerRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const isEllipsisActive = (e) => {
    return (e.offsetWidth < e.scrollWidth);
  }

  useEffect(() => {
    if (headerRef.current && isEllipsisActive(headerRef.current)) {
      setIsTruncated(true);
    }
  }, [headerText]);

  const renderHeaderText = (status: string | null | undefined, delegateProfile: boolean | null = false) => {
    const content = (
      <Heading
        ref={headerRef}
        color="content.accent.default"
        lineHeight="24px"
        variant={size === "condensed" ? "h4" : "h3"}
        mb="standard.2xs"
        width={size === "condensed" || delegateProfile ? undefined : { base: "100%", lg: "80%" }}
        maxWidth={"100%"}
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
          justifyContent={"space-between"}
          flex={1}
          gap="0"
          display="flex"
          flexDirection={delegateProfile ? "column" : "row"}
          alignItems="flex-start"
          width={delegateProfile ? "100%" : "calc(100% - 60px)"}
        >
          <Box maxWidth={status && !delegateProfile ? "calc(100% - 80px)" : "calc(100% - 40px)"} width="100%" {...(delegateProfile ? { order: "2" } : {})}>
            <Box height="24px">{isTruncated ? <Tooltip label={headerText}>{renderHeaderText(status)}</Tooltip> : renderHeaderText(status)}</Box>
            {!delegateProfile ? <Box mt="-4px">{renderSubheaderText()}</Box> : null}
          </Box>
          {status ? <Badge
            variant={status}
            size="condensed"
            sx={{
              order: delegateProfile ? "1" : "2"
            }}
          >{status}</Badge> : null}
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

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        gap="standard.base"
        width="80%"
      >
        <Flex flexDirection={"column"} justifyContent={"center"} flex={1}  maxWidth={status && !delegateProfile ? "calc(100% - 80px)" : "calc(100% - 40px)"} width="100%" {...(delegateProfile ? { order: "2" } : {})}>
          {isTruncated ? <Tooltip label={headerText}>{renderHeaderText(status, delegateProfile)}</Tooltip> : renderHeaderText(status, delegateProfile)}
          {!delegateProfile ? renderSubheaderText() : null}
        </Flex>
        {status ? <Badge
            variant={status}
            size="condensed"
            sx={{
              order: delegateProfile ? "1" : "2"
            }}
          >{status}</Badge> : null}
      </Box>
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
