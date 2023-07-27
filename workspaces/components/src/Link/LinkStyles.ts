import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const body = defineStyle({
  color: "#1A1523",

  fontWeight: "600",
  fontSize: "15px",

  _hover: {
    textDecoration: "underline",
  },
});

export const linkTheme = defineStyleConfig({
  variants: { body },
});
