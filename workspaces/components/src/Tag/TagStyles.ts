import { tagAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tagAnatomy.keys);

const review = definePartsStyle({
  container: {
    px: "standard.xs",
    py: "standard.base",
    background: "surface.forms.default",
    borderColor: "border.forms",
    borderWidth: "1px",
    color: "content.default.default",
    fontSize: "10px",
    fontWeight: "500",
    borderRadius: "condensed.base",
    position: "relative",
    lineHeight: "16px",
    letterSpacing: "0.2px",
  },
});
const amount = definePartsStyle({
  container: {
    px: "standard.xs",
    py: "standard.base",
    background: "#DCDBDD",
    borderColor: "transparent",
    borderWidth: "1px",
    color: "#1A1523",
    fontSize: "10px",
    fontWeight: "500",
    borderRadius: "condensed.round",
    position: "relative",
    lineHeight: "16px",
    letterSpacing: "0.2px",
  },
});

export const tagTheme = defineMultiStyleConfig({
  variants: {
    review,
    amount,
  },
  defaultProps: {
    variant: "review",
  },
});
