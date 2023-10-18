import { Box, Grid } from "@chakra-ui/react";
import { ReactNode } from "react";

type RootProps = {
  children: ReactNode;
};

const Root = ({ children }: RootProps) => {
  return (
    <Grid
      bg="surface.bgPage"
      templateColumns={{
        base: "1fr",
        lg: "1fr 288px",
        xl: "1fr 380px",
      }}
      templateAreas={{
        base: `
          "content"
          "voting"
          "discussion"
        `,
        lg: `
          "content voting"
          "discussion voting"
        `,
        xl: `
          "content voting"
          "discussion voting"
        `,
      }}
    >
      {children}
    </Grid>
  );
};

type ContentProps = {
  children: ReactNode;
};

const Content = ({ children }: ContentProps) => {
  return (
    <Box
      gridArea="content"
      px={{
        base: "standard.md",
        md: "standard.2xl",
        lg: "standard.2xl",
      }}
      pt={{ base: "standard.2xl", lg: "standard.3xl" }}
      pb={{ base: "standard.2xl" }}
      borderRightWidth={{ base: "none", lg: "1px" }}
      borderColor="border.forms"
    >
      <Box maxWidth={{ base: "100%", lg: "558px", xl: "690px" }} mx="auto">
        {children}
      </Box>
    </Box>
  );
};

type DiscussionProps = {
  children: ReactNode;
};

const Discussion = ({ children }: DiscussionProps) => {
  return (
    <Box
      gridArea="discussion"
      px={{
        base: "standard.md",
        md: "standard.2xl",
        lg: "standard.2xl",
      }}
      pb={{ base: "standard.2xl", lg: "standard.3xl" }}
      pr={{ base: "standard.2xl" }}
      borderRightWidth={{ base: "none", lg: "1px" }}
      borderColor="border.forms"
    >
      <Box
        maxWidth={{ base: "100%", lg: "558px", xl: "690px" }}
        mx="auto"
        pt={{ base: "standard.2xl" }}
      >
        {children}
      </Box>
    </Box>
  );
};

type WidgetProps = {
  children: ReactNode;
};

const VoteWidget = ({ children }: WidgetProps) => {
  return (
    <Box gridArea="voting">
      <Box
        height="100%"
        pt={{ base: "standard.2xl", lg: "standard.3xl" }}
        px={{
          base: "standard.md",
          md: "standard.2xl",
          lg: "standard.xl",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export { Root, Content, Discussion, VoteWidget };
