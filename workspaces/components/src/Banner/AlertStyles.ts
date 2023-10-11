import { alertAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(alertAnatomy.keys);

const info = definePartsStyle({
  container: {
    border: "0px solid",
    borderRadius: "standard.base",
    py: "standard.sm",
    pl: "standard.sm",
    pr: "standard.sm",
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

const commentHidden = definePartsStyle({
  container: {
    border: "1px solid",
    borderColor: "border.dividers",
    borderRadius: "standard.base",
    py: "standard.sm",
    pl: "standard.sm",
    pr: "standard.sm",
    background: "surface.cards.default",
  },
  icon: {
    svg: {
      stroke: "content.onSurface.default",
    },
  },
  description: {
    color: "content.default.default",
    fontSize: "0.75rem",
    lineHeight: "1.25rem",
    fontWeight: "500",
    letterSpacing: "0.12px",
  },
});

const error = definePartsStyle({
  container: {
    border: "0px solid",
    borderRadius: "standard.base",
    py: "standard.sm",
    pl: "standard.sm",
    pr: "standard.2xl",
    background: "#F6C9CE",
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
  variants: { info, error, commentHidden },

  defaultProps: { variant: "info" },
});
