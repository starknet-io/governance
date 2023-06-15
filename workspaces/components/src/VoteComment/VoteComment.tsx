import { Box, Flex, VStack } from "@chakra-ui/react";
import { Text } from "src/Text";
import { truncateAddress } from "src/utils";

type Props = {
  address?: string;
  ethAddress?: string;
  voteCount?: number;
  comment?: string;
  voted?: "For" | "Against" | "Abstain";
};

const variant = {
  For: "#20AC70",
  Against: "#E1503E",
  Abstain: "#6B6B80",
};

export const VoteComment = ({
  address = "0x1234567890234223234234234234234 ",
  ethAddress = "sylve.eth",
  voted = "For",
  voteCount = 10.5,
  comment = "The Builder/’s council is excited about the new features but expects higher quality of documentation for future releases. For this reason the council has voted against",
}: Props) => {
  return (
    <Flex flexDirection="column" gap="6px" mb="32px">
      <Flex flexDirection="row" gap="8px" alignItems="center">
        <Box
          width="10px"
          height="10px"
          bg={variant[voted]}
          borderRadius="50%"
        />
        <Box>
          <Text variant="breadcrumbs" fontWeight="500" color="#292932">
            {ethAddress ? ethAddress : truncateAddress(address)}
          </Text>
        </Box>
        <Box>
          <Text variant="breadcrumbs" color="#6C6C75">
            {voteCount}B votes
          </Text>
        </Box>
      </Flex>
      <Box>
        <Text variant="breadcrumbs" color="#545464">
          {comment}
        </Text>
      </Box>
    </Flex>
  );
};
