import { HStack } from "@chakra-ui/react";
import { Meta } from "@storybook/react";
import { Tag } from "./Tag";
import { ThemeProvider } from "../ThemeProvider";

export default {
  title: "governance-ui/Tag",
  component: Tag,
} as Meta<typeof Tag>;

export const Review = () => (
  <ThemeProvider>
    <HStack p={12}>
      <Tag>Review</Tag>
    </HStack>
  </ThemeProvider>
);
