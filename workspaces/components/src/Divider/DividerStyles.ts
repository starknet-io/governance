import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const primary = defineStyle({
  borderWidth: "1px", // change the width of the border
  borderStyle: "solid", // change the style of the border
  borderRadius: 0, // set border radius to 10
  borderColor: "border.dividers",
});

export const dividerTheme = defineStyleConfig({
  variants: { primary },
  defaultProps: {
    variant: "primary",
  },
});
