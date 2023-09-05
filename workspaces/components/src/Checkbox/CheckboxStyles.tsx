import { checkboxAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  label: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    fontWeight: "500",
    color: "content.accent.default",
    marginLeft: "standard.sm",
  },
  control: {
    boxSize: "24px",
    borderColor: "border.forms",
    "&:hover": {
      borderColor: "#C8C7CB",
    },
    _checked: {
      bg: "surface.accent.default",
      borderColor: "surface.accent.default",
      "&:hover": {
        bg: "surface.accent.default",
        borderColor: "surface.accent.default",
      },
    },
    borderRadius: "4px", // change the border radius of the control
  },
});

export const checkboxTheme = defineMultiStyleConfig({ baseStyle });
