import { Box } from "@chakra-ui/react";
import React from "react";

type Props = {
  children?: React.ReactNode;
  maxWidth?: string;
};

export const ContentContainer = ({ children, maxWidth = "auto" }: Props) => {
  return (
    <Box
      flex="1"
      display="flex"
      px={{ base: "26.5px", md: "36.5px", lg: "36.5px", xl: "76.5px" }}
      pt="40px"
      maxWidth={maxWidth === "auto" ? "auto" : `${maxWidth}`}
    >
      {children}
    </Box>
  );
};
