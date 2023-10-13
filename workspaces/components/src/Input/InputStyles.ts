import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

const primary = definePartsStyle({
  field: {
    color: "content.accent.default",
    _placeholder: {
      color: "content.support.default",
    },
    background: "surface.forms.default",
    border: "1px solid",
    borderColor: "border.forms",
    boxShadow: "0px 1px 1px 0px rgba(0, 0, 0, 0.05)",
    _invalid: {
      borderColor: "border.danger",
    },
    _hover: {
      borderColor: "#C8C7CB",

      // _placeholder: {
      //   color: "content.support.hover",
      // },
    },
    _focus: {
      borderColor: "#86848D",
    },
  },

  element: {
    _hover: {
      svg: {
        boxSize: "40px!important",
      },
    },
    height: "100%",
    svg: {
      boxSize: "20px",
    },
  },
});

const standard = defineStyle({
  fontSize: "0.875rem",
  lineHeight: "1.25rem",
  fontWeight: "500",
  p: "standard.sm",
  height: "44px",
  borderRadius: "standard.base",
});
const condensed = defineStyle({
  fontSize: "0.875rem",
  lineHeight: "1.25rem",
  fontWeight: "500",
  p: "condensed.sm",
  h: "36px",
  borderRadius: "condensed.base",
});

const sizes = {
  standard: definePartsStyle({ field: standard, addon: standard }),
  md: definePartsStyle({ field: standard, addon: standard }),
  condensed: definePartsStyle({ field: condensed, addon: condensed }),
  sm: definePartsStyle({ field: condensed, addon: condensed }),
};
export const inputTheme = defineMultiStyleConfig({
  variants: { primary },
  sizes,
  defaultProps: {
    variant: "primary",
    size: "standard",
  },
});
