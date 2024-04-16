import { Box, SimpleGrid, Flex, Icon } from "@chakra-ui/react";
import { Pattern } from "./Pattern";
import { Heading } from "src/Heading";
import { Text } from "src/Text";
import { HomePageCard } from "src/Card/HomePageCard";
import { HomeContainer } from "src/ContentContainer";
import React from "react";
import { CoinsV2, DelegatesV2, InfoCircleIcon } from "../Icons/UiIcons";
import { Tooltip } from "../Tooltip";

type Props = {
  title?: string;
  tagline?: string;
  strapline?: string;
  l1Delegated: string;
  l2Delegated: string;
  vSTRKTotal: any;
  STRKTotal: any;
  l1StrkTotal: any;
};

export const BannerHome = ({
  strapline = "Starknet",
  title = "Governance Hub",
  tagline = "Where the community propose, debate and vote on the direction of Starknet",
  l2Delegated,
  l1Delegated,
  vSTRKTotal,
  STRKTotal,
}: Props) => {
  // Convert string props to numbers for calculation
  const vSTRKTotalNum = Math.floor(parseFloat(vSTRKTotal));
  const STRKTotalNum = Math.floor(parseFloat(STRKTotal));

  // Calculate the percentage
  const vSTRKOfTotalSTRKPercentage = STRKTotalNum
    ? (vSTRKTotalNum / STRKTotalNum) * 100
    : 0;

  // Format the result for display
  const formattedPercentage = new Intl.NumberFormat("en", {
    maximumFractionDigits: 0, // Limit decimal places to 2
  }).format(vSTRKOfTotalSTRKPercentage);

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
          <Box
            pos="relative"
            display="flex"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
          >
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
            <Box pos="absolute" top={-2} left={"calc(50% - 118px)"}>
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
          <Flex
            w={"100%"}
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            <Box maxW={400} mt="8px">
              <Text fontWeight="600" lineHeight={1.5} color="#0B0B4C">
                {tagline}
              </Text>
            </Box>
          </Flex>
        </HomeContainer>
      </Box>
      <Box pos="relative" zIndex="100">
        <HomeContainer
          display="grid"
          zIndex="2"
          transform={{
            base: "translateY(-100px)",
          }}
          px="1rem"
          mb={{
            base: "-100px",
          }}
        >
          <Box
            background="white"
            borderRadius={"8px"}
            border={"1px solid"}
            borderColor={"border.forms"}
            px={"standard.sm"}
          >
            <Box p={"standard.md"}>
              <SimpleGrid
                columns={{
                  base: 2,
                  md: 4,
                  lg: 5,
                }}
                spacingX="10px"
                spacingY="10px"
              >
                <Box gridColumn={{ base: "1 / -1", lg: "auto" }}>
                  <Icon as={CoinsV2} width={"32px"} height={"32px"} />
                  <Text variant={"medium"} color={"content.default.default"}>
                    STRK
                  </Text>
                </Box>
                <Box>
                  <Heading
                    variant={"h3"}
                    fontSize={{
                      base: "16px",
                      md: "21px",
                    }}
                    lineHeight={{
                      base: "1.5rem",
                      md: "2rem",
                    }}
                  >
                    {new Intl.NumberFormat("en", {
                      maximumFractionDigits: 0,
                    }).format(vSTRKTotal)}
                  </Heading>
                  <Text
                    variant="bodySmallMedium"
                    color="content.accent.default"
                    display="flex"
                    gap={"4px"}
                  >
                    vSTRK
                    <Tooltip label="Total supply of vSTRK token">
                      <InfoCircleIcon />
                    </Tooltip>
                  </Text>
                </Box>
                <Box>
                  <Heading
                    variant={"h3"}
                    lineHeight={{
                      base: "1.5rem",
                      md: "2rem",
                    }}
                    fontSize={{
                      base: "16px",
                      md: "21px",
                    }}
                  >
                    {new Intl.NumberFormat("en", {
                      maximumFractionDigits: 0,
                    }).format(STRKTotal)}
                  </Heading>
                  <Text
                    display="flex"
                    gap={"4px"}
                    variant="bodySmallMedium"
                    color="content.accent.default"
                  >
                    STRK L2
                    <Tooltip label="Total supply of STRK token">
                      <InfoCircleIcon />
                    </Tooltip>
                  </Text>
                </Box>
                <Box>
                  <Heading
                    lineHeight={{
                      base: "1.5rem",
                      md: "2rem",
                    }}
                    variant={"h3"}
                    fontSize={{
                      base: "16px",
                      md: "21px",
                    }}
                  >
                    {formattedPercentage} %
                  </Heading>
                  <Text
                    display="flex"
                    gap={"4px"}
                    variant="bodySmallMedium"
                    color="content.accent.default"
                  >
                    vSTRK of total STRK
                    <Tooltip label="Ratio of vSTRK:STRK">
                      <InfoCircleIcon />
                    </Tooltip>
                  </Text>
                </Box>
                <Box></Box>
              </SimpleGrid>
            </Box>
            <Box w={"100%"} h={"1px"} background={"border.forms"} />
            <Box p={"standard.md"}>
              <SimpleGrid
                spacingX="10px"
                spacingY="10px"
                columns={{
                  base: 2,
                  md: 4,
                  lg: 5,
                }}
              >
                <Box gridColumn={{ base: "1 / -1", lg: "auto" }}>
                  <Icon as={DelegatesV2} width={"32px"} height={"32px"} />
                  <Text variant={"medium"} color={"content.default.default"}>
                    Delegated
                  </Text>
                </Box>
                <Box>
                  <Heading
                    lineHeight={{
                      base: "1.5rem",
                      md: "2rem",
                    }}
                    variant={"h3"}
                    fontSize={{
                      base: "16px",
                      md: "21px",
                    }}
                  >
                    {l2Delegated}
                  </Heading>
                  <Text
                    display="flex"
                    gap={"4px"}
                    variant="bodySmallMedium"
                    color="content.accent.default"
                  >
                    vSTRK Delegated
                    <Tooltip label="Total amount of vSTRK Delegated">
                      <InfoCircleIcon />
                    </Tooltip>
                  </Text>
                </Box>
                <Box>
                  <Heading
                    lineHeight={{
                      base: "1.5rem",
                      md: "2rem",
                    }}
                    variant={"h3"}
                    fontSize={{
                      base: "16px",
                      md: "21px",
                    }}
                  >
                    {l1Delegated}
                  </Heading>
                  <Text
                    display="flex"
                    gap={"4px"}
                    variant="bodySmallMedium"
                    color="content.accent.default"
                  >
                    L1 STRK delegated
                    <Tooltip label="Total amount of STRK on delegated on Ethereum">
                      <InfoCircleIcon />
                    </Tooltip>
                  </Text>
                </Box>
                <Box>
                  <Heading
                    lineHeight={{
                      base: "1.5rem",
                      md: "2rem",
                    }}
                    variant={"h3"}
                    fontSize={{
                      base: "16px",
                      md: "21px",
                    }}
                  >
                    ?
                  </Heading>
                  <Text
                    display="flex"
                    gap={"4px"}
                    variant="bodySmallMedium"
                    color="content.accent.default"
                  >
                    Self Delegated
                    <Tooltip label="something">
                      <InfoCircleIcon />
                    </Tooltip>
                  </Text>
                </Box>
              </SimpleGrid>
            </Box>
          </Box>
        </HomeContainer>
      </Box>
    </>
  );
};
