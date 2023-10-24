import { Box, Flex, Icon } from "@chakra-ui/react";
import {
  SignatureIcon,
  VoteAbstainIcon,
  VoteAgainstIcon,
  VoteForIcon,
} from "src/Icons";
import { Text } from "src/Text";
import { Tooltip } from "src/Tooltip";
import { formatVotesAmount, truncateAddress } from "src/utils";

type Props = {
  address: string;
  ethAddress?: string;
  voteCount: number;
  comment?: string;
  voted: "For" | "Against" | "Abstain";
  author?: string | null;
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
  author,
}: Props) => {
  const formatVotes = formatVotesAmount(voteCount);

  const renderAuthorOrAddress = () => {
    const content = (
      <Text variant="smallStrong" color="content.accent.default">
        {author || (ethAddress ? ethAddress : truncateAddress(address))}
      </Text>
    );

    return !author ? (
      <Tooltip label={ethAddress ? ethAddress : address} aria-label="Address">
        {content}
      </Tooltip>
    ) : (
      content
    );
  };

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
            <VoteForIcon boxSize="18px" color={variant[voted]} />
          )}
          {voted === "Against" && (
            <VoteAgainstIcon boxSize="18px" color={variant[voted]} />
          )}
          {voted === "Abstain" && (
            <VoteAbstainIcon boxSize="18px" color={variant[voted]} />
          )}
        </Box>

        <Box>{renderAuthorOrAddress()}</Box>

        <Flex ml="auto" justifyContent={"center"} gap="standard.xs">
          <Text variant="smallStrong" color="content.support.default">
            {formatVotes} votes
          </Text>
          <Box as="span" mt="-3px">
            <SignatureIcon />
          </Box>
        </Flex>
      </Flex>
      <Box maxWidth={{ base: "500px", md: "800px", lg: "380px" }}>
        <Text
          width="100%"
          sx={{ whiteSpace: "pre-wrap" }}
          variant="small"
          color="content.default.default"
        >
          {comment}
        </Text>
      </Box>
    </Flex>
  );
};
