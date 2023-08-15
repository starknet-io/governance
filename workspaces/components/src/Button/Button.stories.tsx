import { VStack, HStack } from "@chakra-ui/react";
import { Meta, Story } from "@storybook/react";
import { Button, props as ButtonProps } from "./Button";
import { ThemeProvider } from "../ThemeProvider";

export default {
  title: "starknet.io/Button",
  component: Button,
} as Meta;

const Template = (args: ButtonProps) => (
  <ThemeProvider>
    <VStack spacing={4}>
      <HStack spacing={4}>
        <Button {...args} />
        <Button {...args} isDisabled={true} />
        <Button {...args} size="condensed" />
      </HStack>
    </VStack>
  </ThemeProvider>
);

export const Primary = Template.bind({});
Primary.args = {
  variant: "primary",
  children: "Primary",
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: "secondary",
  children: "Secondary",
};

export const Outline = Template.bind({});
Outline.args = {
  variant: "outline",
  children: "Outline",
};

export const Ghost = Template.bind({});
Ghost.args = {
  variant: "ghost",
  children: "Ghost",
};

export const Danger = Template.bind({});
Danger.args = {
  variant: "danger",
  children: "Danger",
};
