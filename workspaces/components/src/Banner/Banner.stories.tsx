import { HStack, VStack } from "@chakra-ui/react";
import { Meta } from "@storybook/react";

import { ThemeProvider } from "../ThemeProvider";
import { Banner } from "./Banner";

export default {
  title: "governance-ui/Banner",
  component: Banner,
} as Meta<typeof Banner>;

export const Default = () => (
  <ThemeProvider>
    <HStack>
      <VStack p={12} spacing="20px" align="flex-start">
        <Banner
          type="info"
          label="Your voting power of 100 STRK is currently assigned to this delegate."
        />
        <Banner type="pending" label="Waiting for transaction to confirm..." />
        <Banner
          onClose={() => console.log("red")}
          type="info"
          label="Your voting power of 100 STRK is currently assigned to this delegate."
        />
      </VStack>
    </HStack>
  </ThemeProvider>
);
