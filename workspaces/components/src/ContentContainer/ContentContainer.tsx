import { Box } from "@chakra-ui/react";
import React from "react";

type Props = {
  children?: React.ReactNode;
  maxWidth?: string;
  center?: boolean;
  subpage?: boolean;
};

export const ContentContainer = ({
  children,
  center = true,
  maxWidth = "1046px",
  subpage = false,
}: Props) => {
  const pxValues = subpage
    ? {
        base: "standard.md", // or whatever value you want when subpages is true
        md: "standard.2xl",
        lg: "standard.xl",
        xl: "standard.xl",
      }
    : {
        base: "standard.md",
        md: "standard.2xl",
        lg: "standard.2xl",
        xl: "standard.2xl",
      };
  return (
    <Box
      flex="1"
      display="flex"
      px={pxValues}
      py={{
        base: "standard.2xl",
        md: "standard.2xl",
        lg: "standard.3xl",
      }}
      maxWidth={maxWidth === "auto" ? "auto" : `${maxWidth}`}
      mx={{ base: center ? "0" : "0", md: center ? "auto" : "0" }}
    >
      {children}
    </Box>
  );
};
