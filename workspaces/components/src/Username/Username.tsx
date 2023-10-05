import { Avatar, Box, Flex } from "@chakra-ui/react";
import { Text } from "../Text";
import { Heading } from "../Heading";
import { Indenticon } from "src/Indenticon";

type Props = {
  src?: string | null;
  displayName: string;
  size?: "condensed" | "standard";
  address: string;
};

export const Username = ({
  src,
  displayName,
  size = "condensed",
  address,
}: Props) => {
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

        <Text color="content.accent.default" variant="small">
          {displayName}
        </Text>
      </Flex>
    );
  }
  return (
    <Flex
      // pl="standard.sm"
      // pr="standard.xs"
      alignItems="center"
      gap="standard.xs"
    >
      {src !== null ? (
        <Avatar size="sm" src={src} />
      ) : (
        <Indenticon size={24} address={address?.toLowerCase()} />
      )}

      <Heading color="content.default.default" variant="h5">
        {displayName}
      </Heading>
    </Flex>
  );
};
