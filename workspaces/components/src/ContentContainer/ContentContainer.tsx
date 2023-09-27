import { Box } from "@chakra-ui/react";
import React from "react";

type Props = {
  children?: React.ReactNode;
  maxWidth?: string;
  center?: boolean;
};

export const ContentContainer = ({
  children,
  center = true,
  maxWidth = "1046px",
}: Props) => {
  return (
    <Box
      flex="1"
      display="flex"
      px={{
        base: "standard.md",
        md: "standard.2xl",
        lg: "standard.2xl",
        xl: "standard.2xl",
      }}
      py={{
        base: "standard.2xl",
        md: "standard.2xl",
        lg: "standard.3xl",
      }}
      maxWidth={maxWidth === "auto" ? "auto" : `${maxWidth}`}
      mx={center ? "auto" : "0"}
    >
      {children}
    </Box>
  );
};
