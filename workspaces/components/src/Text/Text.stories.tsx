import React from "react";
import { VStack } from "@chakra-ui/react";
import { Meta } from "@storybook/react";
import { theme } from "..//style/theme";

import { Text as GovernanceText } from "./Text";
import { ChakraProvider } from "@chakra-ui/react";

export default {
  title: "governance-ui/Typography",
  component: GovernanceText,

  decorators: [
    (Story: React.ComponentType) => (
      <ChakraProvider theme={theme}>
        <Story />
      </ChakraProvider>
    ),
  ],
} as Meta<typeof Text>;

export const Text = () => (
  <VStack p={12} align="flex-start">
    <GovernanceText variant="small">small 12/20</GovernanceText>
    <GovernanceText variant="smallStrong">small-strong 12/20</GovernanceText>
    <GovernanceText variant="medium">medium 14/20</GovernanceText>
    <GovernanceText variant="mediumStrong">medium-strong 14/20</GovernanceText>
    <GovernanceText variant="large">large 15/24</GovernanceText>
    <GovernanceText variant="largeStrong">large-strong 15/24</GovernanceText>
    <GovernanceText variant="captionSmall">caption-small 10/16</GovernanceText>
    <GovernanceText variant="captionSmallStrong">
      caption-small-strong 10/16
    </GovernanceText>
    <GovernanceText variant="captionSmallUppercase">
      caption-small-uppercase 10/16
    </GovernanceText>
  </VStack>
);
