import { tagAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tagAnatomy.keys);

const listCard = definePartsStyle({
  container: {
    px: "8px",
    py: "4px",
    background: "#FDFCFD",
    border: "1px solid rgba(26, 21, 35, 0.09)",
    color: "hsla(247, 4%, 45%, 1)",
    fontSize: "10px",
    fontWeight: "500",
    borderRadius: "4px",
    position: "relative",
  },
});
const primary = definePartsStyle({
  container: {
    px: "8px",
    py: "2px",
    background: "#F4F4F6",
    color: "#6B6B80",
    fontSize: "10px",
    borderRadius: "3px",
    border: "1px solid rgba(114, 113, 122, 0.16)",
    textTransform: "uppercase!important",
  },
});

export const tagTheme = defineMultiStyleConfig({
  variants: {
    listCard,
    primary,
  },
});
