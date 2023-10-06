import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

// define the base component styles
const baseStyle = {
  borderRadius: "md", // add a border radius
  fontWeight: "normal", // change the font weight
  border: "10px solid",
  borderColor: "red",
  bg: "surface.accent.default",
  // add a border"
};

const primaryVariant = defineStyle(() => {
  return {
    fontWeight: "normal", // change the font weight
    border: "0 solid",
    borderColor: "red",
    bg: "surface.accent.default",
    textAlign: "center",
    boxShadow: "none",
  };
});

const variants = {
  primary: primaryVariant,
};

// define custom sizes
const sizes = {
  standard: defineStyle({
    borderRadius: "standard.base", // add a border radius
    fontSize: "12px!important",
    padding: "standard.xs",
    letterSpacing: "0.5px",
    maxWidth: "246px",

    fontWeight: "600",
  }),
};

// export the component theme
export const tooltipTheme = defineStyleConfig({
  variants,
  sizes,
  defaultProps: {
    size: "standard",
    variant: "primary",
  },
});
