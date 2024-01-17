import { Box, Flex, Progress, Stack } from "@chakra-ui/react";
import { Text } from "../Text";
import { formatVotesAmount } from "src/utils";

type Props = {
  voteCount?: number;
  totalVotes: bigint;
  choice: 0 | 1 | 2;
  userVote: boolean;
  type: string;
  active?: boolean;
  strategies: Array<{ network: string; params: any }>;
  delegationSymbol?: string;
};

const variant = {
  For: "success",
  Against: "danger",
  Abstain: "neutral",
  0: "success",
  1: "danger",
  2: "neutral",
};

const formatPercentage = (voteCount: bigint, totalVotes: bigint) => {
  if (totalVotes === 0n) {
    return '0'; // Avoid division by zero
  }

  // Calculate percentage parts
  const percentage = (voteCount * 100n * 100n) / totalVotes;
  const wholePart = percentage / 100n;
  const fractionalPart = percentage % 100n;

  // Format fractional part (ensure it has two digits)
  const formattedFractionalPart = fractionalPart < 10n ? `0${fractionalPart}` : `${fractionalPart}`;

  // Construct final formatted percentage string
  if (formattedFractionalPart === '00') {
    return `${wholePart}`; // No decimal places needed
  } else {
    return `${wholePart}.${formattedFractionalPart}`;
  }
};
const getVariantKey = (type: string): "For" | "Against" | "Abstain" => {
  if (type.includes("Yes") || type.includes("For") || type.includes("most"))
    return "For";
  if (type.includes("No") || type.includes("Against") || type.includes("least"))
    return "Against";
  return "Abstain"; // Default case
};

export const VoteStat = (props: Props) => {
  // Ensure voteCount is treated as a regular number, default to 0 if undefined
  const voteCount = props.voteCount || 0;

  // Calculate votePercentage
  const votePercentageBigInt = props.totalVotes > 0n
    ? (BigInt(voteCount) * 100n * 100n) / props.totalVotes
    : 0n;

  const votePercentage = Number(votePercentageBigInt) / 100; // Convert to Number and adjust for two decimal places

  // Format voteCount and votePercentage
  const voteCountFormatted = formatVotesAmount(voteCount);
  const percentageText = formatPercentage(BigInt(voteCount), props.totalVotes); // Use BigInt for voteCount here


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
            {percentageText}% {props.userVote ? "✓" : ""}{" "}
            {props.type}
          </Text>
        </Box>
        <Text
          textTransform="uppercase"
          variant="captionSmallStrong"
          color="content.default.default"
        >
          {voteCountFormatted}{" "}
          {"votes"}
        </Text>
      </Flex>
      <Box bg="purple" width="100%">
        <Progress
          variant={variant?.[props.choice] || variant[getVariantKey(props.type)]}
          height="4px"
          value={votePercentage} // Ensure this is a Number
        />
      </Box>
    </Stack>
  );
};

