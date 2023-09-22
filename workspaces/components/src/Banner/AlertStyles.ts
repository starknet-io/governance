import { alertAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(alertAnatomy.keys);

const info = definePartsStyle({
  container: {
    maxWidth: "327px",
    border: "0px solid",
    borderRadius: "standard.base",
    py: "standard.sm",
    pl: "standard.sm",
    pr: "standard.2xl",
    background: "surface.info.default",
  },
  icon: {
    svg: {
      stroke: "content.onSurface.default",
    },
  },
  description: {
    color: "content.onSurface.default",
    fontSize: "0.75rem",
    lineHeight: "1.25rem",
    fontWeight: "500",
    letterSpacing: "0.12px",
  },
});

export const alertTheme = defineMultiStyleConfig({
  variants: { info },

  defaultProps: { variant: "info" },
});
