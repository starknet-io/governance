import { cardAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

const variants = {
  delegate: definePartsStyle({
    container: {
      minWidth: "316px",
      borderColor: "border.forms",
      borderWidth: "1px",
      boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.04)",
      bg: "surface.forms.default",
      borderRadius: "standard.md",
    },
    header: {
      paddingBottom: "standard.lg",
    },
    body: {
      px: "standard.md",
      py: "0px",
    },
    footer: {
      paddingTop: "standard.lg",
    },
  }),
};

// export variants in the component theme
export const cardTheme = defineMultiStyleConfig({
  variants,
});
