// ChakraDatePicker.stories.tsx

import { Meta } from "@storybook/react";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { ChakraDatePicker } from "./ChakraDatePicker"; // Adjust the path accordingly

type Story<T = unknown> = ((args: T) => JSX.Element) & { args?: Partial<T> };

export default {
  title: "Governance-ui/ChakraDatePicker",
  component: ChakraDatePicker,
  argTypes: {
    single: { control: "boolean" },
    range: { control: "boolean" },
    showTimePicker: { control: "boolean" },
  },
} as Meta;

type Props = {
  single?: boolean;
  range?: boolean;
  showTimePicker?: boolean;
};

const Template: Story<Props> = (args: Props) => (
  <ChakraProvider>
    <Box p={4}>
      <ChakraDatePicker {...args} />
    </Box>
  </ChakraProvider>
);

export const SingleDate = Template.bind({});
SingleDate.args = {
  single: true,
  range: false,
  showTimePicker: false,
};

export const RangeDate = Template.bind({});
RangeDate.args = {
  single: false,
  range: true,
};

export const SingleDateWithTime = Template.bind({});
SingleDateWithTime.args = {
  single: true,
  range: false,
  showTimePicker: true,
};

export const RangeDateWithTime = Template.bind({});
RangeDateWithTime.args = {
  single: false,
  range: true,
  showTimePicker: true,
};
