import { Box } from "@chakra-ui/react";
import { Pattern } from "./Pattern";
import { Heading } from "src/Heading";
import { Text } from "src/Text";

type Props = {
  title?: string;
  tagline?: string;
  snipCount?: number;
  votePropCount?: number;
  delegateCount?: number;
  delegatedTokens?: number;
};

export const BannerHome = ({
  title = "Starknet governance hub",
  tagline = "Where the community propose, discuss and influence the direction of Starknet. ",
  snipCount = 0,
  votePropCount = 0,
  delegateCount = 0,
  delegatedTokens = 0,
}: Props) => {
  return (
    <Box position={"relative"} mb="48px">
      <Box
        px={{ base: "26.5px", md: "76.5px" }}
        position="absolute"
        bottom="-32px"
        display={{ base: "none", md: "none", lg: "flex" }}
        alignItems={"center"}
        flexDirection={{ base: "column", md: "row" }}
        height="68px"
        zIndex={"2"}
        gap="16px"
      >
        <Stat label="Total Snips" value={snipCount} />
        <Stat label="Total Voting Proposals" value={votePropCount} />
        <Stat label="Total Delegates" value={delegateCount} />
        <Stat label="Delegated Tokens" value={delegatedTokens} />
      </Box>

      <Box
        width="100%"
        height="240px"
        position="relative"
        borderBottom="1px solid #DCDBDD"
        overflow="hidden"
      >
        <Box position="absolute" inset="0">
          <Pattern />
        </Box>
        <Box position="absolute" inset="0" zIndex="1">
          <Box px={{ base: "26.5px", md: "76.5px" }} pt="72px">
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
        </Box>
      </Box>
    </Box>
  );
};

const Stat = ({ label, value }: { label: string; value: number }) => {
  return (
    <Box
      pl="12px"
      pr="56px"
      py="8px"
      borderRadius="6px"
      bg="#FBFBFB"
      border="1px solid rgba(35, 25, 45, 0.10)"
    >
      <Text color="#86848D" fontSize="12px" textTransform={"uppercase"}>
        {label}
      </Text>
      <Text color="#4A4A4F" fontSize="21px" fontWeight="600">
        {value}
      </Text>
    </Box>
  );
};
