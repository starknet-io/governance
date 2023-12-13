import { Box, Flex, Progress, Stack } from "@chakra-ui/react";
import { Text } from "../Text";
import { formatVotesAmount } from "src/utils";

type Props = {
  voteCount?: number;
  totalVotes: number;
  userVote: boolean;
  type: string;
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
const getVariantKey = (type: string): "For" | "Against" | "Abstain" => {
  if (type.includes("Yes") || type.includes("For")) return "For";
  if (type.includes("No") || type.includes("Against")) return "Against";
  return "Abstain"; // Default case
};

export const VoteStat = (props: Props) => {
  console.log(props.type);
  const votePercentage =
    props.totalVotes > 0
      ? ((props.voteCount || 0) / props.totalVotes) * 100
      : 0;
  const voteCountFormatted = formatVotesAmount(props.voteCount || 0);

  return (
    <Stack mb="condensed.sm" spacing="0" textTransform="uppercase">
      <Flex
        flexDirection="row"
        gap="standard.base"
        justifyContent="space-between"
        mb="1px"
      >
        <Box>
          <Text variant="captionSmallStrong" color="content.default.default">
            {formatPercentage(votePercentage)} % {props.userVote ? "✓" : ""}
          </Text>
        </Box>
        <Text
          textTransform="lowercase"
          variant="captionSmallStrong"
          color="content.default.default"
        >
          {voteCountFormatted} votes
        </Text>
      </Flex>
      <Box bg="purple" width="100%">
        <Progress
          variant={variant[getVariantKey(props.type)]}
          height="4px"
          value={votePercentage}
        />
      </Box>
    </Stack>
  );
};
