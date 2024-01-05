import { Box, Flex, Icon } from "@chakra-ui/react";
import { VoteAbstainIcon, VoteAgainstIcon, VoteForIcon } from "#src/Icons";
import { Text } from "#src/Text";
import { formatVotesAmount } from "#src/utils";

type Props = {
  choice: number;
  voteCount: number;
};

export const VoteReview = ({ voteCount = 0, choice }: Props) => {
  const formattedCount = formatVotesAmount(voteCount);
  return (
    <Flex
      bg="surface-forms-default"
      p="16px"
      gap="standard.xs"
      border="1px solid"
      borderColor=" border.forms"
      borderRadius="8px"
      boxShadow=" 0px 1px 2px 0px rgba(0, 0, 0, 0.04)"
    >
      <Text variant="small" color="content.accent.default">
        Voting
      </Text>

      {choice === 1 && <VoteForIcon color="#44D095" boxSize="20px" />}
      {choice === 2 && <VoteAgainstIcon color="#EC796B" boxSize="20px" />}
      {choice === 3 && <VoteAbstainIcon color="#4A4A4F" boxSize="20px" />}
      <Text variant="small" color="content.accent.default">
        with {formattedCount} votes
      </Text>
    </Flex>
  );
};
