import { Box, Image } from "@chakra-ui/react";
// import { NoDelegatesIcon, NoPostsIcon, NoSnipsIcon, VoteIcon } from "src/Icons";
import { Text } from "src/Text";
import noVotingProps from "./assets/no-voting-proposals-found.svg";
import noDelegates from "./assets/no-delegates-found.svg";
import noPastComments from "./assets/no-past-comments-yet.svg";
import noPastVotes from "./assets/no-past-votes-yet.svg";
type Props = {
  title?: string;
  type: "posts" | "votes" | "delegates" | "proposals" | null;
  minHeight?: string;
  action?: React.ReactNode;
};

export const EmptyState = ({
  minHeight = "100px",
  title = "No posts",
  type = "posts",
  action,
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
      gap="24px"
    >
      {type === "posts" && (
        // <Icon as={NoPostsIcon} boxSize={104} color="#86848D" />
        <Image src={noPastComments} width="320px" />
      )}
      {type === "votes" && <Image src={noVotingProps} width="320px" />}
      {type === "delegates" && <Image src={noDelegates} width="320px" />}
      {type === "proposals" && <Image src={noVotingProps} width="320px" />}

      <Text
        color="#4A4A4F"
        fontFamily="Poppins"
        fontSize="16px"
        fontWeight={"600"}
      >
        {title}
      </Text>
      {action}
    </Box>
  );
};
