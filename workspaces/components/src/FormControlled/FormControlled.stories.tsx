import { Meta } from "@storybook/react";
import { ThemeProvider } from "../ThemeProvider";
import { Select } from "src/Multiselect";
import { Box, HStack, Stack, Flex, Textarea, Mark } from "@chakra-ui/react";
import { FormControlled } from "src/FormControlled";
import { Heading } from "src/Heading";
import { Input } from "src/Input";
import { SearchIcon } from "src/Icons";
import { MarkdownEditor } from "src/Editor";

export default {
  title: "governance-ui/FormControlled",
  component: FormControlled,
  FormControlled,
} as Meta<typeof FormControlled>;

const SORTING_OPTIONS = [
  { label: "Newest", value: "desc" },
  { label: "Oldest", value: "asc" },
  { label: "Most discussed", value: "most_discussed" },
];

export const Default = () => (
  <ThemeProvider>
    <Flex justify="center" padding="standard.2xl">
      <HStack
        spacing="56px"
        alignItems="start"
        wrap="wrap"
        maxWidth="600px"
        width="100%"
      >
        <Stack minWidth="300px" width="100%" spacing="22px" alignItems="start">
          <Heading variant="h3">Standard</Heading>
          <FormControlled
            label="Input"
            helperText="This is a not required field so..."
          >
            <Input placeholder="Type here..." size="standard" />
          </FormControlled>

          <FormControlled
            label="Input icon"
            helperText="This is a not required field so..."
            isInvalid
            errorMessage={"This is an error message"}
          >
            <Input
              placeholder="Type here..."
              size="standard"
              icon={<SearchIcon />}
              isInvalid
            />
          </FormControlled>
          <FormControlled
            label="Text area"
            helperText="This is a not required field so..."
          >
            <Textarea
              variant="primary"
              placeholder="Type here..."
              size="standard"
            />
          </FormControlled>
          <FormControlled
            isInvalid
            label="Text area"
            helperText="This is a not required field so..."
            errorMessage={"This is an error message"}
          >
            <Textarea
              variant="primary"
              placeholder="Type here..."
              size="standard"
            />
          </FormControlled>

          <FormControlled
            label="Markdown Editor"
            helperText="This is a not required field so..."
          >
            <MarkdownEditor onChange={() => console.log("changed")} />
          </FormControlled>
          <FormControlled
            isInvalid
            isRequired
            label="Markdown Editor"
            helperText="This is a not required field so..."
            errorMessage={"This is an error message"}
          >
            <MarkdownEditor onChange={() => console.log("changed")} />
          </FormControlled>

          <FormControlled
            label="Select"
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
            label="Select Multi"
            isRequired
            errorMessage={"This is an error message"}
          >
            <Select
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
