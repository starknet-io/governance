import { Box, Flex, Progress, Stack } from "@chakra-ui/react";

import { Text } from "../Text";
type Props = {
  voteCount?: number;
  type: "For" | "Against" | "Abstain";
  active?: boolean;
};

const variant = {
  For: "success",
  Against: "danger",
  Abstain: "neutral",
};

export const VoteStat = (props: Props) => {
  return (
    <Stack fontSize="10px" spacing="4px" textTransform="uppercase">
      <Flex flexDirection="row" gap="8px" justifyContent="space-between">
        <Box>
          <Text fontWeight="medium" color="black">
            55 % for
          </Text>
        </Box>
        <Text color="black">8.68 Votes</Text>
      </Flex>
      <Box mb="20px" width="100%">
        <Progress variant={variant[props.type]} height="4px" value={55} />
      </Box>
    </Stack>
  );
};
