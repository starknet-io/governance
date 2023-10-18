import { Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";

type LeftAsideProps = {
  children?: ReactNode | undefined;
};

const LeftAside = ({ children }: LeftAsideProps) => {
  return (
    <Flex
      bg="surface.forms.default"
      width="234px"
      height="100vh"
      display={{ base: "none", md: "block" }}
      position="sticky"
      top="0"
      overflow={"auto"}
      borderRight="1px solid"
      borderColor="border.forms"
    >
      {children}
    </Flex>
  );
};

type MainProps = {
  children?: ReactNode | undefined;
};
const Main = ({ children }: MainProps) => {
  return (
    <Box display="flex" flexDirection="column" flex={1}>
      {children}
    </Box>
  );
};
type ContentProps = {
  children?: ReactNode | undefined;
};
const Content = ({ children }: ContentProps) => {
  return (
    <Box as="main" role="main" flex={1}>
      {children}
    </Box>
  );
};

type LayoutProps = {
  children?: ReactNode | undefined;
};

const Root = ({ children }: LayoutProps) => {
  return (
    <Flex width="100vw" minHeight="100vh" direction="row">
      {children}
    </Flex>
  );
};

type HeaderProps = {
  children?: ReactNode | undefined;
};
const Header = ({ children }: HeaderProps) => {
  return (
    <Box display="flex" flex={1}>
      {children}
    </Box>
  );
};

export { Root, LeftAside, Main, Header, Content };
