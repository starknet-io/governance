import { Box, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";

type LeftAsideProps = {
  children?: ReactNode | undefined;
};

const LeftAside = ({ children }: LeftAsideProps) => {
  return (
    <Flex
      height="100vh"
      direction="column"
      as="aside"
      order={{ base: "2", lg: "0" }}
      role="complementary"
      width="234px"
      position={{ base: "unset", lg: "sticky" }}
      bg="#FFFFFF"
      top="0"
      paddingLeft="12px"
      paddingRight="12px"
      display={{ base: "none", lg: "flex" }}
      borderRight="1px solid #E4E5E7"
      paddingTop="34px"
      paddingBottom="24px"
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
    <Box
      as="main"
      role="main"
      flex={1}
      // paddingLeft="48px"
      // paddingRight="48px"
      // paddingTop="40px"
    >
      {children}
    </Box>
  );
};

type LayoutProps = {
  children?: ReactNode | undefined;
};

const Root = ({ children }: LayoutProps) => {
  return (
    <Box
      display="flex"
      flexDirection={{ base: "column", md: "row", lg: "row" }}
    >
      {children}
    </Box>
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
