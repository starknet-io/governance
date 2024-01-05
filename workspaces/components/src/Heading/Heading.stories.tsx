import React from "react";
import { VStack, ChakraProvider } from "@chakra-ui/react";
import { Meta } from "@storybook/react";
import { theme } from "#src/style/theme";

import { Heading } from "./Heading";

export default {
  title: "governance-ui/Typography",
  component: Heading,

  decorators: [
    (Story: React.ComponentType) => (
      <ChakraProvider theme={theme}>
        <Story />
      </ChakraProvider>
    ),
  ],
} as Meta<typeof Heading>;

export const Headings = () => (
  <VStack p={12} align="flex-start">
    <Heading variant="h2">H2 28/36</Heading>
    <Heading variant="h3">H3 21/32</Heading>
    <Heading variant="h4">H4 16/24</Heading>
    <Heading variant="h5">H5 16/20</Heading>
    <Heading variant="h6">H6 14/20</Heading>
  </VStack>
);
