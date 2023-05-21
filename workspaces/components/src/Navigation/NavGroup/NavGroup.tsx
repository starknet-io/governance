import { Flex, Stack, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface NavGroupProps {
  label?: string;
  children: ReactNode;
  alignEnd?: boolean;
}

export const NavGroup = (props: NavGroupProps) => {
  const { label, children, alignEnd } = props;
  return (
    <Flex
      flexDirection="column"
      marginTop={alignEnd ? 'auto' : '24px'}
      padding="0"
    >
      {label && (
        <Text
          px="3"
          fontSize="12px"
          fontWeight="semibold"
          textTransform="uppercase"
          letterSpacing="widest"
          color="gray.500"
          mb="3"
        >
          {label}
        </Text>
      )}
      <Stack spacing="1">{children}</Stack>
    </Flex>
  );
};
