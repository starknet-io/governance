import { switchAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(switchAnatomy.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  label: {
    fontSize: "16px",
    top: "-4px",
    marginLeft: "standard.sm",
    position: "relative",
    fontWeight: "500",
    color: "content.accent.default",
  },
  container: {},
  thumb: {
    bg: "#FBFBFB",
  },
  track: {
    bg: "rgba(35, 25, 45, 0.10)",
    _checked: {
      bg: "content.accent.default",
    },
  },
});

export const switchTheme = defineMultiStyleConfig({
  baseStyle,
  defaultProps: { size: "md" },
});
