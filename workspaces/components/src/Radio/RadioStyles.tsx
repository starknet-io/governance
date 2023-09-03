import { radioAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(radioAnatomy.keys);

const baseStyle = definePartsStyle({
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

export const radioTheme = defineMultiStyleConfig({ baseStyle });
