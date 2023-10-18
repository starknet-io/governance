import { Avatar, Box, Flex, Menu, MenuItem } from "@chakra-ui/react";
import { Text } from "src/Text";
import { Indenticon } from "src/Indenticon";
import { Heading } from "src/Heading";
import { Dropdown } from "src/Dropdown";
import { EllipsisIcon } from "src/Icons";
type Props = {
  size?: "condensed" | "standard";
  headerText?: string | null;
  subheaderText?: string | null;
  address?: string | null;
  src?: string | null;
  dropdownChildren?: React.ReactNode;
};

export const AvatarWithText = ({
  size,
  headerText,
  subheaderText,
  address,
  src,
  dropdownChildren,
}: Props) => {
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
        <Box>
          <Heading
            color="content.accent.default"
            lineHeight="24px"
            variant="h4"
            mb="standard.2xs"
          >
            {headerText}
          </Heading>
          <Text
            lineHeight="10px"
            color="content.support.default"
            variant="captionSmallUppercase"
            pb="standard.base"
          >
            {subheaderText}
          </Text>
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
        <Heading
          color="content.accent.default"
          lineHeight="24px"
          variant="h3"
          mb="standard.2xs"
          width={{ base: "100%", lg: "80%" }}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {headerText}
        </Heading>
        <Text color="content.default.default" variant="small">
          {subheaderText}
        </Text>
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
