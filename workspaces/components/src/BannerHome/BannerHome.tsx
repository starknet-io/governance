import { Box, SimpleGrid } from "@chakra-ui/react";
import { Pattern } from "./Pattern";
import { Heading } from "src/Heading";
import { Text } from "src/Text";
import { HomePageCard } from "src/Card/HomePageCard";
import { HomeContainer } from "src/ContentContainer";

type Props = {
  title?: string;
  tagline?: string;
  strapline?: string;
};

const homeLinks = [
  {
    title: "Starknet’s progressive governance",
    description:
      "A decentralized network that strives to evolve over time needs to have progressively evolving decentralized governance mechanisms to support protocol upgrades.",
    link: "/learn/starknet's_progressive_governance",
  },
  {
    title: "Wrap STRK to vSTRK to vote",
    description:
      "In order to vote or to designate a delegate to vote for you on Starknet, you need to wrap STRK as vSTRK using the Governance hub. You can unwrap anytime.",
    link: "/learn/How_to_convert_between_STRK_and_vSTRK",
  },
  {
    title: "How to delegate voting power",
    description:
      "If you are a STRK token holder, you can select a delegate to vote in your place for protocol changes.",
    link: "/learn/how_to_delegate_voting_power",
  },
];
export const BannerHome = ({
  strapline = "Starknet",
  title = "Governance Hub",
  tagline = "Where the community propose, debate and vote on the direction of Starknet",
}: Props) => {
  return (
    <>
      <Box
        width="100%"
        height="356px"
        position="relative"
        borderBottom="1px solid #DCDBDD"
        overflow="hidden"
        bgGradient="radial(573.81% 50% at 50% 50%, #F9F3EF 0%, #F5F2FA 82.25%, #F1F6FA 100%)"
      >
        <Box position="absolute" inset="0" zIndex="1">
          <Pattern />
        </Box>
        <HomeContainer
          pt={{
            base: "48px",
            md: "64px",
          }}
        >
          <Box pos="relative">
            <Heading
              letterSpacing="-0.48px"
              variant="h2"
              fontWeight="700"
              fontSize="48px"
              lineHeight="48px"
              display="flex"
              flexDirection="column"
              color="brand.primary.cosmicBlue.solid.12"
            >
              <span>{strapline}</span>
              <Box
                bgGradient="linear(270deg, #F09280 1.91%, #E87888 38.19%, #D672EF 73.51%, #BCA1F3 95.51%)"
                bgClip="text"
                w="fit-content"
              >
                {title}
              </Box>
            </Heading>
            <Box pos="absolute" top={-2} left={-3}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.6412 19.4833L12.2663 14.4623C12.5966 13.4412 13.4025 12.6465 14.4274 12.3331L19.4727 10.7816C20.171 10.5683 20.1767 9.58296 19.484 9.35834L14.4614 7.73315C13.4422 7.40282 12.6475 6.59683 12.3323 5.57188L10.7827 0.526415C10.5694 -0.170097 9.58417 -0.177648 9.35956 0.516977L7.73444 5.5379C7.40413 6.55719 6.59818 7.35186 5.57328 7.66708L0.528047 9.21678C-0.170321 9.43196 -0.177871 10.4154 0.516721 10.64L5.5393 12.2652C6.55854 12.5955 7.35317 13.4034 7.66838 14.4283L9.218 19.4719C9.43128 20.1703 10.4165 20.1779 10.6412 19.4833Z"
                  fill="#0B0B4C"
                />
              </svg>
            </Box>
          </Box>
          <Box maxW={400} mt="8px">
            <Text fontWeight="600" lineHeight={1.5} color="#0B0B4C">
              {tagline}
            </Text>
          </Box>
        </HomeContainer>
      </Box>
      <Box pos="relative">
        <HomeContainer
          position="relative"
          zIndex="2"
          transform={{
            base: "translateY(-70px)",
            md: "translateY(-50%)",
          }}
          px="0px"
          mb={{
            base: "-50px",
            md: "-80px",
          }}
        >
          <SimpleGrid
            columns={3}
            // gap="standard.md" // gap causing overflow on tablet
            overflowX="scroll"
            gridTemplateColumns="repeat(3, minmax(264px, 1fr))"
            p="standard.md"
            pb="0"
            sx={{
              "> *:not(:last-child)": {
                marginRight: "standard.md",
              },
              "&::-webkit-scrollbar": {
                display: "none",
              },
              scrollbarWidth: "none",
              overflowStyle: "none",
              msOverflowStyle: "none",
            }}
          >
            {homeLinks.map((link) => (
              <HomePageCard
                key={link.title}
                title={link.title}
                description={link.description}
                link={link.link}
              />
            ))}
          </SimpleGrid>
        </HomeContainer>
      </Box>
    </>
  );
};
