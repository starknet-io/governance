import { Box, HStack } from '@chakra-ui/react';
import { ReactElement, ReactNode } from 'react';
import { BsCaretRightFill } from 'react-icons/bs';

interface NavItemProps {
  href?: string;
  label: string;
  subtle?: boolean;
  active?: boolean;
  icon: ReactElement;
  endElement?: ReactElement;
  children?: ReactNode;
}

export const NavItem = (props: NavItemProps) => {
  const { active, subtle, icon, children, label, endElement, href } =
    props;
  return (
    <HStack
      as="a"
      href={href}
      w="full"
      px="3"
      py="2"
      height="36px"
      cursor="pointer"
      userSelect="none"
      rounded="md"
      transition="all 0.2s"
      bg={active ? '#EEEEF1' : undefined}
      _hover={{ bg: '#EEEEF1' }}
      _active={{ bg: '#EEEEF1' }}
    >
      <Box
        fontSize="14px"
        color={active ? 'currentcolor' : '#33333E'}
      >
        {icon}
      </Box>
      <Box
        flex="1"
        fontWeight="inherit"
        fontSize="14px"
        color={subtle ? '#33333E' : undefined}
      >
        {label}
      </Box>
      {endElement && !children && <Box>{endElement}</Box>}
      {children && (
        <Box fontSize="xs" flexShrink={0} as={BsCaretRightFill} />
      )}
    </HStack>
  );
};
