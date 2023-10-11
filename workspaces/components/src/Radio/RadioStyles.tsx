import { radioAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(radioAnatomy.keys);

const baseStyle = definePartsStyle({
  label: {
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
      bg: "white",
      color: "surface.accent.default",
      borderColor: "surface.accent.default",
      "&:hover": {
        bg: "white",
        color: "surface.accent.default",
        borderColor: "surface.accent.default",
      },
    },
  },
});
const standardControl = defineStyle({
  boxSize: "24px",
});
const standardLabel = defineStyle({
  lineHeight: "20px",
  fontWeight: "500",
  fontSize: "14px",
  letterSpacing: "0.07px",
});
const sizes = {
  standard: definePartsStyle({
    control: standardControl,
    label: standardLabel,
  }),
};

export const radioTheme = defineMultiStyleConfig({
  baseStyle,
  sizes,
  defaultProps: { size: "standard" },
});
