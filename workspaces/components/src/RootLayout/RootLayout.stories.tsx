import { Meta } from "@storybook/react";
import * as Layout from "./RootLayout";
import { ThemeProvider } from "../ThemeProvider";
import { Text } from "src/Text";

export default {
  title: "governance-ui/Layout",
  component: Layout.Root,
} as Meta<typeof Layout.Root>;

export const RootLayout = () => (
  <ThemeProvider>
    <Layout.Root>
      <Layout.LeftAside>
        <Text>LeftAside</Text>
      </Layout.LeftAside>
      <Layout.Main>
        <Text>Main</Text>
      </Layout.Main>
      {/* <Layout.RightAside /> */}
    </Layout.Root>
  </ThemeProvider>
);
