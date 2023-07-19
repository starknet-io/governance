import { Box } from "@chakra-ui/react";
import { Pattern } from "./Pattern";
import { Heading } from "src/Heading";

type Props = {
  title?: string;
  tagline?: string;
};

export const BannerHome = ({
  title = "Starknet governance hub",
  tagline = "Where the community propose, discuss and influence the direction of Starknet. ",
}: Props) => {
  return (
    <Box width="100%" height="240px" position="relative">
      <Box position="absolute" inset="0">
        <Pattern />
      </Box>
      <Box position="absolute" inset="0" zIndex="1">
        <Box px={{ base: "26.5px", md: "76.5px" }} pt="40px">
          <Box>
            <Heading
              bgGradient="linear(119deg, #EC796B , #D672EF )"
              bgClip="text"
              variant="h2"
              fontWeight="500"
              fontSize="34px"
              fontFamily="Inter"
            >
              {title}
            </Heading>
          </Box>
          <Box>
            <Heading
              variant="h3"
              fontWeight="500"
              fontSize="15px"
              fontFamily="Inter"
            >
              {tagline}
            </Heading>
          </Box>
        </Box>
        {/* <Box>
          <Box>Total SNIPs</Box>
          <Box>Total Voting Proposals</Box>
          <Box>Total Delegates</Box>
          <Box>Delegated Tokens</Box>
        </Box> */}
      </Box>
    </Box>
  );
};
