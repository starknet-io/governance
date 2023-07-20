import { Box, Icon } from "@chakra-ui/react";
import { NoPostsIcon, VoteIcon } from "src/Icons";
import { Text } from "src/Text";

type Props = {
  title: string;
  type: "posts" | "votes" | null;
};

export const EmptyState = ({ title = "No posts", type = "posts" }: Props) => {
  return (
    <Box
      py="32px"
      border="1px solid  rgba(35, 25, 45, 0.10)"
      borderRadius="4px"
      display="flex"
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection="column"
    >
      {type === "posts" && (
        <Icon as={NoPostsIcon} boxSize={104} color="#86848D" />
      )}
      {type === "votes" && <Icon as={VoteIcon} boxSize={104} color="#86848D" />}

      <Text color="#86848D" fontFamily="Poppins" fontSize="16px">
        {title}
      </Text>
    </Box>
  );
};
