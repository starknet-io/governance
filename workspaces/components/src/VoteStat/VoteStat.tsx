import { Box, Flex, Progress, Stack, Tooltip } from "@chakra-ui/react";

import { Text } from "../Text";
import { formatVotesAmount } from "src/utils";

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
  // const voteCountFormatted = formatVoteCount(props.voteCount || 0);
  const voteCountFormatted = formatVotesAmount(props.voteCount || 0);
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
      <Stack mb="standard.sm" spacing="0" textTransform="uppercase">
        <Flex
          flexDirection="row"
          gap="8px"
          justifyContent="space-between"
          mb="standard.base"
        >
          <Box>
            <Text variant="captionSmallStrong" color="content.default.default">
              {formatPercentage(votePercentage)} % {props.userVote ? "✓" : ""}
            </Text>
          </Box>
          <Text variant="captionSmallStrong" color="content.default.default">
            {voteCountFormatted} Votes
          </Text>
        </Flex>
        <Box bg="purple" width="100%">
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
