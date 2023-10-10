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
    <Box
      sx={{
        width: "100%",

        // containerType: "inline-size",
        // zIndex: "0",
      }}
    >
      <Flex gap="standard.sm" alignItems="center" width="100%">
        <Box>
          {src !== null ? (
            <Avatar size="xlg" src={src} />
          ) : (
            <Indenticon size={64} address={address} />
          )}
        </Box>
        <Flex width="100%" overflow="hidden">
          <Flex flexDirection={"column"} justifyContent={"center"} width="100%">
            <Heading
              color="content.accent.default"
              lineHeight="24px"
              variant="h3"
              mb="standard.2xs"
              noOfLines={1}
              width={"100%"}
            >
              {headerText}
            </Heading>
            <Text color="content.default.default" variant="small">
              {subheaderText}
            </Text>
          </Flex>
        </Flex>
        <Flex width="44px" height="64px">
          {dropdownChildren === null ? null : (
            <Dropdown buttonIcon={<EllipsisIcon boxSize="20px" />}>
              {dropdownChildren}
            </Dropdown>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};
