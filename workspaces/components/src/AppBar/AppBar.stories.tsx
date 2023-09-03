import { Box, ButtonGroup, Flex, Popover, Select } from "@chakra-ui/react";
import { Meta } from "@storybook/react";
import { AppBar } from "./AppBar";
import { ThemeProvider } from "../ThemeProvider";

import { FilterPopoverContent, FilterPopoverIcon } from "src/Filter";

import { Text } from "src/Text";
import { Button } from "src/Button";
import { FiltersIcon } from "src/Icons";

export default {
  title: "governance-ui/AppBar",
  component: AppBar,
} as Meta<typeof AppBar>;

export const Default = () => (
  <ThemeProvider>
    <AppBar>
      <Flex flexDirection={"row"} gap="4px" alignItems={"center"}>
        <Box minWidth={"50px"}>
          <Text
            fontSize="14px"
            fontWeight={"600"}
            lineHeight="20px"
            letterSpacing={"0.07px"}
          >
            Sort by
          </Text>
        </Box>
        <Select
          size="sm"
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
      </Flex>
      <ButtonGroup display={{ base: "none", md: "flex" }} ml="8px">
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
      </ButtonGroup>
      <Box display="flex" marginLeft="auto" gap="12px">
        <Button
          size="condensed"
          variant="outline"
          onClick={() => console.log("clicked")}
        >
          Delegate to address
        </Button>
        <Button
          as="a"
          href="/delegates/create"
          size="condensed"
          variant="primary"
        >
          Create delegate profile
        </Button>
      </Box>
    </AppBar>
  </ThemeProvider>
);
