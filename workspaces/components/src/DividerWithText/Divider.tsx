import { Box, Divider, AbsoluteCenter } from "@chakra-ui/react";

interface DividerTypes {
  text: string;
}

export const DividerWithText = ({ text }: DividerTypes) => {
  return (
    <Box position="relative" padding="10">
      <Divider color="#DCDBDD" />
      <AbsoluteCenter
        px="4"
        bg="#F9F8F9"
        color="#4A4A4F"
        fontWeight="600"
        fontSize="12px"
      >
        {text}
      </AbsoluteCenter>
    </Box>
  );
};

export default DividerWithText;
