import { Flex, Icon } from "@chakra-ui/react";
import {
  EthereumIcon,
  StarknetIcon,
  VoteAbstainIcon,
  VoteAgainstIcon,
  VoteForIcon,
} from "../Icons";
import { Text } from "../Text";
import { formatVotesAmount } from "../utils";

type Props = {
  isStarknet?: boolean;
  voteCount: number;
  choice: number;
};
export const PastVote = ({ isStarknet, voteCount, choice }: Props) => {
  const formattedCount = formatVotesAmount(voteCount);

  return (
    <Flex
      bg="surface-forms-default"
      p="16px"
      gap="standard.xs"
      border="1px solid"
      alignItems="center"
      justifyContent="space-between"
      borderColor=" border.forms"
      borderRadius="8px"
      boxShadow=" 0px 1px 2px 0px rgba(0, 0, 0, 0.04)"
    >
      <Flex alignItems="center" gap={"standard.xs"}>
        <Icon as={isStarknet ? StarknetIcon : EthereumIcon} />
        <Text color={"content.support.default"} variant="smallStrong">
          {isStarknet ? "Starknet" : "Ethereum"}
        </Text>
      </Flex>
      <Flex gap="standard.xs" alignItems="center">
        <Text color={"content.default.default"} variant="smallStrong">
          {"Submitted"}
        </Text>
        {choice === 1 && <VoteForIcon color="#44D095" boxSize="20px" />}
        {choice === 2 && <VoteAgainstIcon color="#EC796B" boxSize="20px" />}
        {choice === 3 && <VoteAbstainIcon color="#4A4A4F" boxSize="20px" />}
        <Text variant="small" color="content.accent.default">
          with {formattedCount} votes
        </Text>
      </Flex>
    </Flex>
  );
};
