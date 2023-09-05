import { Stack, Switch as ChakraSwitch } from "@chakra-ui/react";
import { Meta } from "@storybook/react";

import { ThemeProvider } from "../ThemeProvider";

export default {
  title: "governance-ui/FormControls",
  component: ChakraSwitch,
} as Meta<typeof ChakraSwitch>;

export const Switch = () => (
  <ThemeProvider>
    <Stack spacing={5} direction="column">
      <ChakraSwitch value="1">Control button heading</ChakraSwitch>
      <ChakraSwitch value="2" isChecked>
        Control button heading
      </ChakraSwitch>
      <ChakraSwitch value="2" disabled>
        Control button heading
      </ChakraSwitch>
    </Stack>
  </ThemeProvider>
);
