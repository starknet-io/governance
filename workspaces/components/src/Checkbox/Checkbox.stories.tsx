import { VStack, Checkbox as ChakraCheckbox } from "@chakra-ui/react";
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
    </VStack>
  </ThemeProvider>
);
