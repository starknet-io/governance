import { cardAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  container: {
    borderRadius: "8px",
    border: "1px solid rgba(35, 25, 45, 0.10)",
    boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.04)",
    _hover: {
      boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.09)",
    },
  },
  header: {
    paddingBottom: "12px",
  },
  body: {
    paddingTop: "2px",
  },
  footer: {
    paddingTop: "2px",
  },
});

export const cardTheme = defineMultiStyleConfig({ baseStyle });
