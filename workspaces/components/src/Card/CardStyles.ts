import { cardAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

const baseStyle = {
  container: {
    borderColor: "border.forms",
    borderWidth: "1px",
    boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.04)",
    bg: "surface.forms.default",
    borderRadius: "8px",
    _hover: {
      borderColor: "border.formsHover",
      boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.04)",
    },
  },
};
const variants = {
  delegate: definePartsStyle({
    container: {
      gap: "standard.lg",
    },
    header: {
      pb: "0",
      px: "standard.md",
    },
    body: {
      px: "standard.md",
      py: "0px",
    },
    footer: {
      paddingTop: "0",
    },
  }),
  homePage: definePartsStyle({
    container: {
      padding: "standard.sm",

      fontSize: "12px",
      lineHeight: "20px",
      letterSpacing: "0.12px",
      fontWeight: 500,
      border: "1px solid border.forms",
      _hover: {
        borderColor: "border.formsHover",
      },
    },
    header: {
      padding: 0,
      fontSize: "15px",
      lineHeight: "24px",
      fontWeight: 600,
      color: "content.accent.default",
    },
    body: {
      padding: 0,
      color: "content.support.default",
    },
    footer: {
      padding: 0,
      paddingTop: "standard.xs",
      fontWeight: 600,
      color: "content.default.default",
    },
  }),
};

// export variants in the component theme
export const cardTheme = defineMultiStyleConfig({
  baseStyle,
  variants,
});
