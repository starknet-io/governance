import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const primary = defineStyle({
  color: "content.links.default",
  borderBottom: "1.5px solid",
  borderColor: "transparent",
  svg: {
    fill: "content.links.default",
  },
  _hover: {
    textDecoration: "none",
    color: "content.links.default",
    borderBottom: "1.5px solid",
    borderColor: "content.links.default",
  },
});

const secondary = defineStyle({
  color: "content.accent.default",
  borderBottom: "1.5px solid",
  borderColor: "transparent",
  svg: {
    fill: "content.accent.default",
  },
  _hover: {
    textDecoration: "none",
    color: "content.accent.default",
    borderBottom: "1.5px solid",
    borderColor: "content.accent.default",
  },
});

const medium = defineStyle({
  lineHeight: "24px",
  fontWeight: "600",
  fontSize: "15px",
  pb: "2px",
});
const small = defineStyle({
  lineHeight: "20px",
  fontWeight: "600",
  fontSize: "12px",
  pb: "2px",
});

export const linkTheme = defineStyleConfig({
  variants: { primary, secondary },
  sizes: { medium, small },
  defaultProps: {
    variant: "secondary",
    size: "medium",
  },
});
