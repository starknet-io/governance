import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

interface NavGroupProps {
  label?: string;
  children: ReactNode;
  alignEnd?: boolean;
  action?: ReactNode;
}

export const NavGroup = (props: NavGroupProps) => {
  const { label, action, children, alignEnd } = props;
  return (
    <Flex
      flexDirection="column"
      marginTop={alignEnd ? "auto" : "24px"}
      padding="0"
    >
      {label && (
        <Text
          px="3"
          fontSize="10px"
          fontWeight="600"
          textTransform="uppercase"
          letterSpacing="0.5px"
          color="#57565D"
          mb="3"
          position="relative"
        >
          {label}
          {action && (
            <Box position="absolute" right="-16px" top="-12px">
              {action}
            </Box>
          )}
        </Text>
      )}
      <Stack spacing="1">{children}</Stack>
    </Flex>
  );
};
