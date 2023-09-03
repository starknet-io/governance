import { Box, Skeleton } from "@chakra-ui/react";
import { Meta } from "@storybook/react";

import { ThemeProvider } from "../ThemeProvider";

export default {
  title: "governance-ui/Skeleton",
  component: Skeleton,
} as Meta<typeof Skeleton>;

export const Page = () => (
  <ThemeProvider>
    <Box
      display={"flex"}
      flexDirection="column"
      gap="12px"
      bg="#fff"
      padding="12px"
      mb="24px"
    >
      <Skeleton height="36px" width="100%" />
      <Skeleton height="300px" width="100%" />
      <Skeleton height="36px" width="100%" />
      <Skeleton height="300px" width="100%" />
      <Skeleton height="300px" width="100%" />
    </Box>
  </ThemeProvider>
);
