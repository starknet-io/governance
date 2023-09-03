import { Stack, RadioGroup, Radio as ChakraRadio } from "@chakra-ui/react";
import { Meta } from "@storybook/react";

import { ThemeProvider } from "../ThemeProvider";

export default {
  title: "governance-ui/FormControls",
  component: ChakraRadio,
} as Meta<typeof ChakraRadio>;

export const Radio = () => (
  <ThemeProvider>
    <RadioGroup defaultValue="1">
      <Stack spacing={5} direction="column">
        <ChakraRadio value="1">Radio</ChakraRadio>
        <ChakraRadio value="2">Radio</ChakraRadio>
      </Stack>
    </RadioGroup>
  </ThemeProvider>
);
