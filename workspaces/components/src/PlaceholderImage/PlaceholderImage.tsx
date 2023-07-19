import { Box, Icon } from "@chakra-ui/react";
import { VoteIcon } from "src/Icons";

export const PlaceholderImage = () => {
  return (
    <Box
      width="100%"
      height=" 100px"
      display="flex"
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Icon as={VoteIcon} boxSize={104} />
    </Box>
  );
};
