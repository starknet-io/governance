import { Box, MenuItem, VStack } from "@chakra-ui/react";
import { Meta } from "@storybook/react";
import { Dropdown } from "./Dropdown";
import { ThemeProvider } from "../ThemeProvider";

import { EllipsisIcon } from "#src/Icons";

export default {
  title: "governance-ui/Dropdown",
  component: Dropdown,
} as Meta<typeof Dropdown>;

export const Default = () => (
  <ThemeProvider>
    <Box>
      <VStack
        p={12}
        spacing={"22px"}
        align={"flex-start"}
        padding="standard.lg"
        width={"100%"}
      >
        <Dropdown buttonIcon={<EllipsisIcon />}>
          <MenuItem>Item 1</MenuItem>
          <MenuItem>Item 2</MenuItem>
          <MenuItem>Item 3</MenuItem>
        </Dropdown>
        <Dropdown buttonVariant="secondary" buttonIcon={<EllipsisIcon />}>
          <MenuItem>Item 1</MenuItem>
          <MenuItem>Item 2</MenuItem>
          <MenuItem>Item 3</MenuItem>
        </Dropdown>
        <Dropdown
          buttonType="standard"
          buttonLabel="dropdown"
          buttonVariant="secondary"
        >
          <MenuItem>Item 1</MenuItem>
          <MenuItem>Item 2</MenuItem>
          <MenuItem>Item 3</MenuItem>
        </Dropdown>

        <Dropdown
          buttonType="standard"
          buttonLabel="dropdown"
          buttonVariant="primary"
        >
          <MenuItem>Item 1</MenuItem>
          <MenuItem>Item 2</MenuItem>
          <MenuItem>Item 3</MenuItem>
        </Dropdown>
      </VStack>
    </Box>
  </ThemeProvider>
);
