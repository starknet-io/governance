import { Meta } from "@storybook/react";
import { ThemeProvider } from "../ThemeProvider";
import { Select } from "./Select";
import { Box, HStack, Stack, Flex } from "@chakra-ui/react";
import { FormControlled } from "../FormControlled";
import { Heading } from "../Heading";
import { Input } from "../Input";
import { SearchIcon } from "../Icons";

export default {
  title: "governance-ui/Select",
  component: Select,
  Select,
} as Meta<typeof Select>;

const SORTING_OPTIONS = [
  { label: "Newest", value: "desc" },
  { label: "Oldest", value: "asc" },
  { label: "Most discussed", value: "most_discussed" },
];

export const Default = () => (
  <ThemeProvider>
    <Flex justify="center" padding="standard.2xl">
      <HStack spacing="56px" alignItems="start" wrap="wrap" maxWidth="600px">
        <Stack minWidth="300px" width="100%" spacing="22px" alignItems="start">
          <Heading variant="h3">Default Select</Heading>

          <FormControlled
            label="hello"
            helperText="This is a not required field so..."
          >
            <Select
              isRequired
              isMulti={false}
              onChange={() => console.log("changed")}
              options={SORTING_OPTIONS}
              placeholder="I'm a placeholder"
            />
          </FormControlled>

          <FormControlled
            label="hello"
            helperText="This is a not required field so..."
          >
            <Input
              placeholder="Type here..."
              size="standard"
              icon={<SearchIcon />}
            />
          </FormControlled>

          <FormControlled
            label="I'm a Select"
            isRequired
            isInvalid
            errorMessage={"This is an error message"}
          >
            <Select
              isInvalid
              isMulti={false}
              onChange={() => console.log("changed")}
              options={SORTING_OPTIONS}
            />
          </FormControlled>
          <FormControlled
            label="I'm a Select"
            isRequired
            helperText="I am readonly or disabled"
          >
            <Select
              placeholder="disabled"
              isReadOnly={true}
              isMulti={false}
              onChange={() => console.log("changed")}
              options={SORTING_OPTIONS}
            />
          </FormControlled>
        </Stack>

        <Stack minWidth="300px" width="100%" spacing="22px" alignItems="start">
          <Heading variant="h3">Select sm</Heading>

          <FormControlled
            label="Multi Select (Small)"
            helperText="This is a not required field so..."
          >
            <Select
              size="sm"
              isMulti={true}
              onChange={() => console.log("changed")}
              options={SORTING_OPTIONS}
            />
          </FormControlled>
          <FormControlled
            label="Invalid Small Select"
            isInvalid
            errorMessage="Error message for this select"
          >
            <Select
              size="sm"
              isInvalid={true}
              isMulti={false}
              onChange={() => console.log("changed")}
              options={SORTING_OPTIONS}
            />
          </FormControlled>
          <FormControlled
            label="Readonly Small Select"
            helperText="This is a not required field so..."
          >
            <Select
              size="sm"
              isReadOnly={true}
              isMulti={false}
              onChange={() => console.log("changed")}
              options={SORTING_OPTIONS}
            />
          </FormControlled>
        </Stack>

        <Stack minWidth="300px" width="100%" spacing="22px" alignItems="start">
          <Heading variant="h3">Multi select</Heading>
          <FormControlled
            label="Multi Select"
            helperText="This is a not required field so..."
          >
            <Select
              tagVariant="select"
              isMulti={true}
              onChange={() => console.log("changed")}
              options={SORTING_OPTIONS}
            />
          </FormControlled>
          <FormControlled
            label="Multi Select (Small)"
            helperText="This is a not required field so..."
          >
            <Select
              size="sm"
              tagVariant="select"
              isMulti={true}
              onChange={() => console.log("changed")}
              options={SORTING_OPTIONS}
            />
          </FormControlled>
        </Stack>
      </HStack>
    </Flex>
  </ThemeProvider>
);
