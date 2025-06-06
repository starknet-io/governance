import { Box, BoxProps, Image } from "@chakra-ui/react";
// import { NoDelegatesIcon, NoPostsIcon, NoSnipsIcon, VoteIcon } from "src/Icons";
import { Text } from "src/Text";
import noVotingProps from "./assets/no-voting-proposals-found.svg";
import noDelegates from "./assets/no-delegates-found.svg";
import noPastComments from "./assets/no-past-comments-yet.svg";
import noPastVotes from "./assets/no-past-votes-yet.svg";
import noPosts from "./assets/no-posts.svg";
import noNotifications from "./assets/no-past-notifications.svg";
import pageNotFound from "./assets/page-not-found.svg";
type Props = {
  title?: string;
  hasBorder?: boolean;
  type:
    | "posts"
    | "votes"
    | "delegates"
    | "proposals"
    | "comments"
    | "notifications"
    | "votesCast"
    | "pageNotFound"
    | null;
  minHeight?: string;
  action?: React.ReactNode;
};

export const EmptyState = ({
  minHeight = "100px",
  title = "No posts",
  type = "posts",
  action,
  hasBorder = true,
}: Props & BoxProps) => {
  return (
    <Box
      py="standard.2xl"
      border="1px solid "
      borderColor={hasBorder ? "rgba(35, 25, 45, 0.10)" : "transparent"}
      borderRadius="4px"
      display="flex"
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection="column"
      flex="1"
      minHeight={minHeight}
      gap="standard.xl"
    >
      {type === "posts" && <Image src={noPosts} width="200px" />}
      {type === "comments" && <Image src={noPastComments} width="200px" />}
      {type === "votes" && <Image src={noVotingProps} width="200px" />}
      {type === "delegates" && <Image src={noDelegates} width="320px" />}
      {type === "proposals" && <Image src={noVotingProps} width="320px" />}
      {type === "votesCast" && <Image src={noPastVotes} width="250px" />}
      {type === "pageNotFound" && <Image src={pageNotFound} width="250px" />}
      {type === "notifications" && (
        <Image src={noNotifications} width="200px" />
      )}

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
