import { Box, ButtonGroup, Flex, Popover, Select } from "@chakra-ui/react";
import { Meta } from "@storybook/react";
import * as AppBar from "./AppBar";
import { ThemeProvider } from "../ThemeProvider";

import { FilterPopoverContent, FilterPopoverIcon } from "..//Filter";

import { Text } from "..//Text";
import { Button } from "..//Button";
import { FiltersIcon } from "..//Icons";

export default {
  title: "governance-ui/AppBar",
  component: AppBar.Root,
} as Meta<typeof AppBar>;

export const Default = () => (
  <ThemeProvider>
    <AppBar.Root>
      <AppBar.Group mobileDirection="row">
        <Box minWidth={"52px"}>
          <Text variant="mediumStrong">Sort by</Text>
        </Box>
        <Select
          size="sm"
          height="36px"
          aria-label="Sort by"
          placeholder="Sort by"
          focusBorderColor={"red"}
          rounded="md"
          value={"option1"}
        >
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </Select>

        <Popover placement="bottom-start">
          <FilterPopoverIcon
            label="Filter by"
            icon={FiltersIcon}
            badgeContent={0}
          />
          <FilterPopoverContent>
            <Text mt="4" mb="2" fontWeight="bold">
              Filters
            </Text>

            <Text mt="4" mb="2" fontWeight="bold">
              Interests
            </Text>
          </FilterPopoverContent>
        </Popover>
      </AppBar.Group>

      <AppBar.Group alignEnd>
        <Button
          width={{ base: "100%", md: "auto" }}
          size="condensed"
          variant="outline"
          onClick={() => console.log("clicked")}
        >
          Delegate to address
        </Button>
        <Button
          width={{ base: "100%", md: "auto" }}
          as="a"
          href="/delegates/create"
          size="condensed"
          variant="primary"
        >
          Create delegate profile
        </Button>
      </AppBar.Group>
    </AppBar.Root>
  </ThemeProvider>
);
