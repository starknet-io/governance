import { avatarAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(avatarAnatomy.keys);

const xs = defineStyle({
  width: "20px",
  height: "20px",
});
const sm = defineStyle({
  width: "24px",
  height: "24px",
});
const md = defineStyle({
  width: "32px",
  height: "32px",
});
const lg = defineStyle({
  width: "48px",
  height: "48px",
});
const xlg = defineStyle({
  width: "64px",
  height: "64px",
});
const withBorder = definePartsStyle({
  container: {
    bg: "#1A1523",
    border: "1px solid #1A1523",
  },
});

const sizes = {
  xs: definePartsStyle({ container: xs }),
  sm: definePartsStyle({ container: sm }),
  md: definePartsStyle({ container: md }),
  lg: definePartsStyle({ container: lg }),
  xlg: definePartsStyle({ container: xlg }),
};

export const avatarTheme = defineMultiStyleConfig({
  sizes,
  variants: { withBorder },
});
