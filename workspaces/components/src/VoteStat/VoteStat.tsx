import { Box, Flex, Progress, Stack, Tooltip } from "@chakra-ui/react";

import { Text } from "../Text";

type Props = {
  voteCount?: number;
  totalVotes: number;
  userVote: boolean;
  type: "For" | "Against" | "Abstain";
  active?: boolean;
  strategies: Array<{ network: string; params: any }>;
  scoresByStrategy: number[];
};

const variant = {
  For: "success",
  Against: "danger",
  Abstain: "neutral",
};

const formatPercentage = (num: number) => {
  return num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);
};

const formatVoteCount = (num: number) => {
  return num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);
};

export const VoteStat = (props: Props) => {
  const votePercentage =
    props.totalVotes > 0
      ? ((props.voteCount || 0) / props.totalVotes) * 100
      : 0;
  const voteCountFormatted = formatVoteCount(props.voteCount || 0);

  return (
    <Tooltip
      label={props.strategies.map((strategy, index) => (
        <Box key={strategy.network}>
          <Text>Symbol: {strategy.params.symbol}</Text>
          <Text>
            Score:{" "}
            {props.scoresByStrategy ? props.scoresByStrategy[index] : "N/A"}
          </Text>
        </Box>
      ))}
      placement="top"
      hasArrow
    >
      <Stack fontSize="10px" spacing="4px" textTransform="uppercase">
        <Flex flexDirection="row" gap="8px" justifyContent="space-between">
          <Box>
            <Text fontWeight="medium" color="black">
              {formatPercentage(votePercentage)} % {props.userVote ? "✓" : ""}
            </Text>
          </Box>
          <Text color="black">{voteCountFormatted} Votes</Text>
        </Flex>
        <Box mb="20px" width="100%">
          <Progress
            variant={variant[props.type]}
            height="4px"
            value={votePercentage}
          />
        </Box>
      </Stack>
    </Tooltip>
  );
};
