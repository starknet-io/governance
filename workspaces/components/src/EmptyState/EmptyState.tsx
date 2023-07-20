import { Box, Icon } from "@chakra-ui/react";
import { NoDelegatesIcon, NoPostsIcon, VoteIcon } from "src/Icons";
import { Text } from "src/Text";

type Props = {
  title?: string;
  type: "posts" | "votes" | "delegates" | "snips" | "proposals" | null;
  minHeight?: string;
};

export const EmptyState = ({
  minHeight = "100px",
  title = "No posts",
  type = "posts",
}: Props) => {
  return (
    <Box
      py="32px"
      border="1px solid  rgba(35, 25, 45, 0.10)"
      borderRadius="4px"
      display="flex"
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection="column"
      flex="1"
      minHeight={minHeight}
    >
      {type === "posts" && (
        <Icon as={NoPostsIcon} boxSize={104} color="#86848D" />
      )}
      {type === "votes" && <Icon as={VoteIcon} boxSize={104} color="#86848D" />}
      {type === "delegates" && (
        <Icon as={NoDelegatesIcon} boxSize={104} color="#86848D" />
      )}
      {type === "proposals" && (
        <Icon as={VoteIcon} boxSize={104} color="#86848D" />
      )}
      {type === "snips" && <Icon as={VoteIcon} boxSize={104} color="#86848D" />}

      <Text color="#86848D" fontFamily="Poppins" fontSize="16px">
        {title}
      </Text>
    </Box>
  );
};
