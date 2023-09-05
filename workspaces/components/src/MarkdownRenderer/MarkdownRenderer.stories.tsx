import { Box } from "@chakra-ui/react";
import { Meta } from "@storybook/react";
import { MarkdownRenderer as GovernanceMarkdownRenderer } from "./MarkdownRenderer";
import { ThemeProvider } from "../ThemeProvider";

export default {
  title: "governance-ui/MarkdownRenderer",
  component: GovernanceMarkdownRenderer,
} as Meta<typeof GovernanceMarkdownRenderer>;

export const MarkdownRenderer = () => (
  <ThemeProvider>
    <Box>
      <GovernanceMarkdownRenderer
        content={`
       # sadfsadf

      `}
      />
    </Box>
  </ThemeProvider>
);
