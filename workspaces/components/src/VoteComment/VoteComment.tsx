import { Box, Flex, Icon } from "@chakra-ui/react";
import {
  SignatureIcon,
  VoteAbstainIcon,
  VoteAgainstIcon,
  VoteForIcon,
} from "src/Icons";
import { Text } from "src/Text";
import { formatVotesAmount, truncateAddress } from "src/utils";

type Props = {
  address: string;
  ethAddress?: string;
  voteCount: number;
  comment?: string;
  voted: "For" | "Against" | "Abstain";
};

const variant = {
  For: "#20AC70",
  Against: "#E1503E",
  Abstain: "#6B6B80",
};

export const VoteComment = ({
  address,
  ethAddress,
  voted,
  voteCount,
  comment,
}: Props) => {
  const formatVotes = formatVotesAmount(voteCount);
  return (
    <Flex
      flexDirection="column"
      gap="standard.base"
      borderBottom="1px solid"
      borderColor="border.forms"
      mb="standard.sm"
      pb="standard.sm"
    >
      <Flex
        flexDirection="row"
        gap="standard.xs"
        alignItems="center"
        justifyContent="flex-start"
      >
        <Box mt="-5px">
          {voted === "For" && (
            <VoteForIcon boxSize="15px" color={variant[voted]} />
          )}
          {voted === "Against" && (
            <VoteAgainstIcon boxSize="15px" color={variant[voted]} />
          )}
          {voted === "Abstain" && (
            <VoteAbstainIcon boxSize="15px" color={variant[voted]} />
          )}
        </Box>

        <Box>
          <Text variant="smallStrong" color="content.accent.default">
            {ethAddress ? ethAddress : truncateAddress(address)}
          </Text>
        </Box>
        <Flex ml="auto" justifyContent={"center"} gap="standard.xs">
          <Text variant="smallStrong" color="content.support.default">
            {formatVotes} votes
          </Text>

          <SignatureIcon />
        </Flex>
      </Flex>
      <Box>
        <Text variant="small" color="content.default.default">
          {comment}
        </Text>
      </Box>
    </Flex>
  );
};
