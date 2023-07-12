import { Box, Flex } from "@chakra-ui/react";
import { ReactElement, ReactNode } from "react";
import { BsCaretRightFill } from "react-icons/bs";

interface NavItemProps {
  href?: string;
  label: string;
  subtle?: boolean;
  active?: string;
  icon?: ReactElement;
  endElement?: ReactElement;
  children?: ReactNode;
}

export const NavItem = (props: NavItemProps) => {
  const { active, subtle, icon, children, label, endElement, href } = props;
  const isActive = active === href;
  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      as="a"
      href={href}
      w="full"
      px="12px"
      py="0"
      gap="8px"
      height="40px"
      cursor="pointer"
      userSelect="none"
      rounded="8px"
      bg={isActive ? "#EEEEF1" : ""}
      _hover={{ bg: "#EEEEF1" }}
      _active={{ bg: "#EEEEF1" }}
    >
      {icon && (
        <Box position="relative" mt="-4px" fontSize="24px">
          {icon}
        </Box>
      )}
      <Box
        flex="1"
        fontWeight="500"
        fontSize="14px"
        letterSpacing="0.07px"
        color={"#57565D"}
      >
        {label}
      </Box>
      {endElement && !children && <Box>{endElement}</Box>}
      {children && <Box fontSize="xs" flexShrink={0} as={BsCaretRightFill} />}
    </Flex>
  );
};
