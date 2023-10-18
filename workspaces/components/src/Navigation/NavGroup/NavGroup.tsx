import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

export interface NavGroupProps {
  label?: string;
  children: ReactNode;
  align?: "end" | "start";
  action?: ReactNode;
}

export const NavGroup = (props: NavGroupProps) => {
  const { label, action, children, align } = props;
  return (
    <Flex
      flexDirection="column"
      marginTop={[
        align === "start" ? "0" : align === "end" ? "20px" : "20px",
        align === "start" ? "0" : align === "end" ? "20px" : "20px",
        align === "start" ? "0" : align === "end" ? "auto" : "20px",
        align === "start" ? "0" : align === "end" ? "auto" : "20px",
        align === "start" ? "0" : align === "end" ? "auto" : "20px",
      ]}
      padding="0"
    >
      {label && (
        <Text
          px="3"
          fontSize="10px"
          fontWeight="600"
          textTransform="uppercase"
          letterSpacing="0.5px"
          color="#86848D"
          mb="4px"
          position="relative"
        >
          {label}
          {action && (
            <Box as="span" position="absolute" right="-16px" top="-12px">
              {action}
            </Box>
          )}
        </Text>
      )}
      <Stack spacing="standard.2xs">{children}</Stack>
    </Flex>
  );
};
