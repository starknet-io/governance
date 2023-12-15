import { Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";

type RootProps = {
  children: ReactNode;
};

const Root = ({ children }: RootProps) => {
  return (
    <Flex bg="surface.bgPage" flexDirection={{ base: "column", lg: "row" }}>
      {children}
    </Flex>
  );
};

const LeftSide = ({ children }: RootProps) => {
  return (
    <Flex
      direction="column"
      flex={1}
      borderRightWidth={{ base: "none", lg: "1px" }}
      borderColor="border.forms"
    >
      {children}
    </Flex>
  );
};

const RightSide = ({ children }: RootProps) => {
  return (
    <Box
      flexBasis={{
        base: undefined,
        lg: "288px",
        xl: "380px",
      }}
    >
      {children}
    </Box>
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
      pb={{ base: "0" }}
      maxWidth="100%"
      overflow={"hidden"}
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
      maxWidth="100%"
      overflow={"hidden"}
    >
      <Box
        maxWidth={{ base: "100%", lg: "558px", xl: "690px" }}
        mx="auto"
        pt={{ base: "standard.md", md: "0" }}
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

export { Root, Content, Discussion, VoteWidget, LeftSide, RightSide };
