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
    px: "standard.base",
    py: "standard.base",
    background: "component.tag.neutral.surface",
    borderColor: "border.forms",
    borderWidth: "0px",
    color: "component.tag.neutral.content",
    fontSize: "10px",
    fontWeight: "600",
    borderRadius: "standard.base",
    position: "relative",
    lineHeight: "16px",
    letterSpacing: "0.2px",
  },
});

const neutral = definePartsStyle({
  container: {
    px: "standard.base",
    py: "standard.base",
    background: "component.tag.neutral.surface",
    borderColor: "border.forms",
    borderWidth: "0px",
    color: "component.tag.neutral.content",
    fontSize: "10px",
    fontWeight: "600",
    borderRadius: "standard.base",
    position: "relative",
    lineHeight: "10px",
    letterSpacing: "0.2px",
    height: "18px",
  },
});

const select = definePartsStyle({
  container: {
    px: "standard.xs",
    py: "standard.base",
    background: "#E9E8EA",
    borderColor: "border.forms",
    borderWidth: "0px",
    color: "##4A4A4F",
    fontSize: "12px",
    fontWeight: "500",
    borderRadius: "standard.base",
    position: "relative",
    lineHeight: "20px",
    fontFamily: "Inter Variable",
    letterSpacing: "0.12px",
    height: "28px",
    _hover: {
      svg: {
        stroke: "red",
      },
    },
  },
});

export const tagTheme = defineMultiStyleConfig({
  variants: {
    review,
    amount,
    neutral,
    select,
  },
  defaultProps: {
    variant: "neutral",
  },
});
