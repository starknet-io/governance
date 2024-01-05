import { Box, Flex, Stack } from "@chakra-ui/react";
import { Meta } from "@storybook/react";

import { ThemeProvider } from "../ThemeProvider";
import { Tooltip } from "./Tooltip";
import { Text } from "..//Text";

export default {
  title: "governance-ui/Tooltip",
  component: Tooltip,
} as Meta<typeof Tooltip>;

export const Default = () => (
  <ThemeProvider>
    <Flex padding="40px" gap={"48px"} flexDirection="column">
      <Box>
        <Tooltip defaultIsOpen label="Hello I am a tooltip">
          <Text variant="largeStrong"> Hello I have a tooltip</Text>
        </Tooltip>
      </Box>
      <Box>
        <Tooltip placement="bottom" label="Hello I am a tooltip">
          <Text variant="largeStrong"> Hello I have a tooltip</Text>
        </Tooltip>
      </Box>
      <Box>
        <Tooltip placement="auto" label="Hello I am a tooltip">
          <Text variant="largeStrong">Placement auto</Text>
        </Tooltip>
      </Box>
    </Flex>
  </ThemeProvider>
);
