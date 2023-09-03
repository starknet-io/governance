import { VStack, Checkbox as ChakraCheckbox, Box } from "@chakra-ui/react";
import { Meta } from "@storybook/react";

import { ThemeProvider } from "../ThemeProvider";

export default {
  title: "governance-ui/FormControls",
  component: ChakraCheckbox,
} as Meta<typeof ChakraCheckbox>;

export const Checkbox = () => (
  <ThemeProvider>
    <VStack p={12} gap="20px" align="flex-start">
      <ChakraCheckbox>Control button heading</ChakraCheckbox>
      <ChakraCheckbox disabled>Control button heading</ChakraCheckbox>
      <ChakraCheckbox isChecked>Control button heading</ChakraCheckbox>
      <Box width="400px">
        <ChakraCheckbox isChecked>
          I understand the role of StarkNet delegates, we encourage all to read
          the Delegate Expectations 328; Starknet Governance announcements Part
          1 98, Part 2 44, and Part 3 34; The Foundation Post 60; as well as the
          Delegate Onboarding announcement 539 before proceeding.
        </ChakraCheckbox>
      </Box>
    </VStack>
  </ThemeProvider>
);
