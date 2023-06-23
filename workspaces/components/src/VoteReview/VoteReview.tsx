import { Box, Icon } from "@chakra-ui/react";
import { MdStopCircle, MdThumbDown, MdThumbUp } from "react-icons/md";

type Props = {
  choice: number;
  voteCount: number;
};

export const VoteReview = ({ voteCount = 0, choice }: Props) => {
  return (
    <Box
      fontSize="14px"
      bg="#FAFAFA"
      p="16px"
      border="1px solid #E4E5E7"
      borderRadius="8px"
      color="#6C6C75"
    >
      Voting
      {choice === 1 && <Icon mx="4px" color="#20AC70" as={MdThumbUp} />}{" "}
      {choice === 2 && <Icon mx="4px" color="#E54D66" as={MdThumbDown} />}
      {choice === 3 && (
        <Icon mx="4px" color="#4D4D56" as={MdStopCircle} />
      )} with {voteCount}
      votes
    </Box>
  );
};
