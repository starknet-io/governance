import { HStack } from "@chakra-ui/react";
import { Meta } from "@storybook/react";
import { Button } from "./Button";
import { ThemeProvider } from "../ThemeProvider";

export default {
  title: "starknet.io/Button",
  component: Button,
} as Meta<typeof Button>;

export const Primary = () => (
  <ThemeProvider>
    <HStack p={12}>
      <>
        <Button variant="primary">Solid button</Button>
        <Button size="condensed" variant="primary">
          primary condensed
        </Button>
      </>
    </HStack>
  </ThemeProvider>
);

export const Secondary = () => (
  <ThemeProvider>
    <HStack p={12}>
      <>
        <Button variant="secondary">Secondary button</Button>
        <Button size="condensed" variant="secondary">
          Secondary condensed
        </Button>
      </>
    </HStack>
  </ThemeProvider>
);

export const Outline = () => (
  <ThemeProvider>
    <HStack p={12}>
      <>
        <Button variant="outline">Outline button</Button>
        <Button size="condensed" variant="outline">
          Outline condensed
        </Button>
      </>
    </HStack>
  </ThemeProvider>
);

export const Ghost = () => (
  <ThemeProvider>
    <HStack p={12}>
      <>
        <Button variant="ghost">Ghost button</Button>
        <Button size="condensed" variant="ghost">
          Ghost condensed
        </Button>
      </>
    </HStack>
  </ThemeProvider>
);
export const Danger = () => (
  <ThemeProvider>
    <HStack p={12}>
      <>
        <Button variant="danger">Danger button</Button>
        <Button size="condensed" variant="danger">
          Danger condensed
        </Button>
      </>
    </HStack>
  </ThemeProvider>
);
