import { Box, Container, Flex, Stack } from '@chakra-ui/react';
import React from 'react';

type LeftAsideProps = {
  children: React.ReactNode;
};

const LeftAside = ({ children }: LeftAsideProps) => {
  return (
    <Flex
      height="100vh"
      direction="column"
      as="aside"
      order={{ base: '2', lg: '0' }}
      role="complementary"
      width="234px"
      position={{ base: 'unset', lg: 'sticky' }}
      bg="#FAFAFA"
      top="0"
      paddingLeft="12px"
      paddingRight="12px"
      display={{ base: 'none', lg: 'flex' }}
      borderRight="1px solid #E2E8F0"
      paddingTop="34px"
      paddingBottom="24px"
    >
      {children}
    </Flex>
  );
};

const RightAside = () => {
  return (
    <Box
      order={{ base: '3', lg: '1' }}
      as="aside"
      role="complementary"
      width={{ base: 'full', lg: 'lg' }}
      alignSelf="start"
      position={{ base: 'unset', lg: 'sticky' }}
      top="0"
      bg="red.200"
    >
      Right Aside
    </Box>
  );
};
type MainProps = {
  children: React.ReactNode;
};
const Main = ({ children }: MainProps) => {
  return (
    <Box
      as="main"
      role="main"
      flex={1}
      paddingLeft="48px"
      paddingRight="48px"
    >
      {children}
    </Box>
  );
};

type LayoutProps = {
  children: React.ReactNode;
};

const Root = ({ children }: LayoutProps) => {
  return (
    <Box
      display="flex"
      flexDirection={{ base: 'column', md: 'row', lg: 'row' }}
      maxWidth="1400px"
    >
      {children}
    </Box>
  );
};

export { Root, LeftAside, RightAside, Main };
