import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const primary = defineStyle({
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
  },
  _focus: {
    borderColor: "#86848D",
  },
});
const comment = defineStyle({
  borderRadius: "6px",
  background: "#F4F4F6",
  fontSize: "14px",
  border: "1px solid #E4E5E7",
  padding: "16px",

  // boxShadow: "0px 1px 1px rgba(228, 229, 231, 0.5)",
  _placeholder: {
    color: "#93939F",
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

export const textareaTheme = defineStyleConfig({
  sizes: { standard, condensed },
  variants: { primary, comment },
  defaultProps: { variant: "primary", size: "standard" },
});
