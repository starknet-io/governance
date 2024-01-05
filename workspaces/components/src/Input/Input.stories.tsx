import { Input as ChakraInput } from "./Input";
import { VStack } from "@chakra-ui/react";
import { Meta } from "@storybook/react";

import { ThemeProvider } from "../ThemeProvider";
import { SearchIcon } from "../Icons";

export default {
  title: "governance-ui/Forms",
  component: ChakraInput,
} as Meta<typeof ChakraInput>;

export const Input = () => (
  <ThemeProvider>
    <VStack p={12} maxWidth="670px" width="100%">
      <ChakraInput
        icon={<SearchIcon />}
        placeholder="Type here..."
        size="standard"
        variant="primary"
      />
      <ChakraInput placeholder="Type here..." size="standard" />
      <ChakraInput
        icon={<SearchIcon />}
        isDisabled
        placeholder="Type here..."
        size="standard"
      />
      <ChakraInput isDisabled placeholder="Type here..." size="standard" />
    </VStack>
    <VStack p={12} maxWidth="670px" width="100%">
      <ChakraInput
        icon={<SearchIcon />}
        placeholder="Type here..."
        size="condensed"
        variant="primary"
        value="Text..."
      />
      <ChakraInput placeholder="Type here..." size="condensed" />
    </VStack>
  </ThemeProvider>
);
