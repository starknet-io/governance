import { Avatar, Box, Flex, useDisclosure, Popover, PopoverTrigger, PopoverContent, PopoverBody } from "@chakra-ui/react";
import { Text } from "src/Text";
import { Indenticon } from "src/Indenticon";
import { Heading } from "src/Heading";
import { Dropdown } from "src/Dropdown";
import { EllipsisIcon } from "src/Icons";
import { Tooltip } from "src/Tooltip";
import { Badge } from "src/Badge";
import { truncateAddress } from "src/utils";
import { CopyToClipboard } from "../CopyToClipboard";
import { navigate } from "vite-plugin-ssr/client/router";
import { User } from "@yukilabs/governance-backend/src/db/schema/users";
import { EthereumIcon, StarknetIcon, LikeIcon, DislikeIcon, ReactionIcon } from "../Icons/UiIcons";

type Props = {
  size?: "condensed" | "standard";
  userDetails?: User | null;
  headerText?: string | Element | null;
  subheaderText?: string | null;
  address?: string | null;
  src?: string | null;
  dropdownChildren?: React.ReactNode;
  headerTooltipContent?: string; // Tooltip for headerText
  subheaderTooltipContent?: string; // Tooltip for subheaderText
  status?: string | null;
  delegateProfile?: boolean;
  withCopy?: boolean;
  headerHref?: string;
  showUserTooltip?: boolean;
};

const UserDetails = ({user}: any) => {
  return (
    <Flex gap="standard.sm" direction="column">
      <Flex gap="standard.sm" alignItems="center">
        <Box>
          {user?.avatarSrc !== null ? (
            <Avatar size="lg" src={user?.avatarSrc} />
          ) : (
            <Indenticon size={48} address={user?.address} />
          )}
        </Box>
        <Box
          position="relative"
          justifyContent={"space-between"}
          flex={1}
          gap="0"
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          width="100%"
        >
          <Box>
            <Heading
              variant="h4"
              height="24px"
              style={{
                width: "90%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: "pointer"
              }}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/profile/${user?.address}`)
              }}
            >{user?.username || user?.ensName}</Heading>
            <Flex alignItems="center" gap="standard.md" alignSelf="stretch">
              <Flex direction="row" gap="standard.base">
                <Box
                  width="20px"
                  height="20px"
                  sx={{
                    "& svg": {
                      width: "20px",
                      height: "20px"
                    }
                  }}
                >
                  <EthereumIcon />
                </Box><Text variant="smallStrong">{truncateAddress(user.address || "").toLowerCase()}</Text>
              </Flex>
              {user.starknetAddress ? <Flex direction="row" gap="standard.base">
                <Box
                  width="20px"
                  height="20px"
                  sx={{
                    "& svg": {
                      width: "20px",
                      height: "20px"
                    }
                  }}
                >
                  <StarknetIcon />
                </Box><Text variant="smallStrong">{truncateAddress(user.starknetAddress || "").toLowerCase()}</Text>
              </Flex> : null}
            </Flex>
          </Box>
        </Box>
      </Flex>
      <Flex justifyContent="space-between" alignItems="flex-start" alignSelf="stretch">
        <Flex alignItems="flex-start" direction="row" gap="standard.base">
          <Text variant="small" color="content.support.default">
            Proposals voted on
          </Text>
          <Text variant="smallStrong" color="content.default.default">{user.votingPower || 0}</Text>
        </Flex>
        <Flex alignItems="flex-start" direction="row" gap="standard.base">
          <Text variant="small" color="content.support.default">
            Total comments
          </Text>
          <Text variant="smallStrong">{user.totalComments || 0}</Text>
        </Flex>
      </Flex>
      <Flex alignSelf="stretch" alignItems="center" direction="row">
        <Text variant="small" color="content.default.default" sx={{minWidth: "50%"}}>
          Votes breakdown
        </Text>
        <Flex
          justifyContent="space-between"
          flexDirection="row"
          width="100%"
        >
          <Flex
            gap="standard.base"
            flexDirection="row"
            alignItems="center"
          >
            <LikeIcon />
            <Text variant="small" color="content.accent.default">
              {user?.likes ?? 0}
            </Text>
          </Flex>
          <Flex
            gap="standard.base"
            flexDirection="row"
            alignItems="center"
          >
            <DislikeIcon />
            <Text variant="small" color="content.accent.default">
              {user?.dislikes ?? 0}
            </Text>
          </Flex>
          <Flex
            gap="standard.base"
            flexDirection="row"
            alignItems="center"
          >
            <ReactionIcon />
            <Text variant="small" color="content.accent.default">
              {user?.comments ?? 0}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

const AvatarWithText = ({
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
  headerHref = "",
  userDetails,
  showUserTooltip = true
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const renderHeaderText = (status: string | null | undefined, delegateProfile: boolean | null = false, showUserTooltip) => {
    const content = showUserTooltip ? (
      <>
        <Popover isLazy trigger="hover" placement="top">
          <PopoverTrigger>
            <Heading
              color="content.accent.default"
              lineHeight="24px"
              variant={size === "condensed" ? "h4" : "h3"}
              mb="standard.2xs"
              width={size === "condensed" || delegateProfile ? undefined : { base: "100%", lg: "80%" }}
              maxWidth={"100%"}
              {...(headerHref && { onClick: e => {
                e.preventDefault();
                e.stopPropagation();
                console.log('uso')
                navigate(headerHref)
              }})}
              onMouseEnter={onOpen}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: headerHref ? "pointer" : "default"
              }}
            >
              {headerText}
            </Heading>
          </PopoverTrigger>
          <PopoverContent
          sx={{
            border: "1px solid",
            borderColor: "border.forms",
            borderRadius: "8px",
            boxShadow: "0px 9px 30px 0px rgba(51, 51, 62, 0.08), 1px 2px 2px 0px rgba(51, 51, 62, 0.10)"
          }}>
            <PopoverBody>
              <UserDetails user={userDetails}/>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </>
    ) : (
      <Heading
        color="content.accent.default"
        lineHeight="24px"
        variant={size === "condensed" ? "h4" : "h3"}
        mb="standard.2xs"
        width={size === "condensed" || delegateProfile ? undefined : { base: "100%", lg: "80%" }}
        maxWidth={"100%"}
        {...(headerHref && { onClick: e => {
          e.preventDefault();
          e.stopPropagation();
          console.log('uso')
          navigate(headerHref)
        }})}
        onMouseEnter={onOpen}
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          cursor: headerHref ? "pointer" : "default"
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
          <Box maxWidth={status && !delegateProfile ? "calc(100% - 80px)" : "calc(100% - 40px)"} {...(delegateProfile ? { order: "2" } : {})}>
            <Box height="24px">{renderHeaderText(status)}</Box>
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
        <Flex flexDirection={"column"} justifyContent={"center"} flex={1}  maxWidth={status && !delegateProfile ? "calc(100% - 80px)" : "calc(100% - 40px)"} {...(delegateProfile ? { order: "2" } : {})}>
          {renderHeaderText(status, delegateProfile)}
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

export {
  AvatarWithText,
  UserDetails
};
