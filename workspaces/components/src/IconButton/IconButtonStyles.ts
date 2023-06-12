import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const simple = defineStyle({
  backgroundColor: "red",
  borderWidth: "0px",
  color: "black",
  boxShadow: "none",
  outline: "none",
});

export const iconButtonTheme = defineStyleConfig({
  variants: { simple },
});
