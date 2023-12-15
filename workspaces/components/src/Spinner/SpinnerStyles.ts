import { defineStyle, defineStyleConfig } from "@chakra-ui/react";
const xxl = defineStyle({
  height: 100,
  width: 100,
});

export const spinnerTheme = defineStyleConfig({
  baseStyle: {
    animationDuration: "1.2s"
  },
  sizes: { xxl }
});
