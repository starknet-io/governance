// ChakraDatePicker.stories.tsx

import { Meta } from "@storybook/react";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { Timepicker } from "./Timepicker"; // Adjust the path accordingly

export default {
  title: "Components/Timepicker",
  component: Timepicker,
  argTypes: {},
} as Meta;

type Props = {
  single?: boolean;
  range?: boolean;
};

const Template = (args: Props) => (
  <ChakraProvider>
    <Box p={4}>
      <Timepicker {...args} />
    </Box>
  </ChakraProvider>
);

export const TimePicker = Template.bind({});
TimePicker.args = {};
