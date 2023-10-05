import { VStack } from "@chakra-ui/react";
import { Meta } from "@storybook/react";
import { Username } from "./Username";
import { ThemeProvider } from "../ThemeProvider";

export default {
  title: "governance-ui/Username ",
  component: Username,
} as Meta<typeof Username>;

export const Default = () => (
  <ThemeProvider>
    <VStack
      p={12}
      spacing={"22px"}
      align={"flex-start"}
      border="1px solid #eee"
      padding="standard.lg"
    >
      <Username
        size="condensed"
        src={
          "https://i.insider.com/60f1a8567b0ec5001800a73e?width=1000&format=jpeg&auto=webp"
        }
        displayName="robbie"
        address={"0x1234567890123456789012345678901234567890"}
      />
      <Username
        size="condensed"
        src={null}
        displayName="cillianhunter.eth"
        address={"0x1234567890123456789012345678901234567890"}
      />
      <Username
        size="standard"
        src={
          "https://i.insider.com/60f1a8567b0ec5001800a73e?width=1000&format=jpeg&auto=webp"
        }
        displayName="cillianhunter.eth"
        address={"0x1234567890123456789012345678901234567890"}
      />
      <Username
        size="standard"
        src={null}
        displayName="cillianhunter.eth"
        address={"0x1234567890123456789012345678901234567890"}
      />
    </VStack>
  </ThemeProvider>
);
