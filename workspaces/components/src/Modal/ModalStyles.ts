import { modalAnatomy as parts } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const primary = definePartsStyle({
  dialog: {
    px: 0,
    // Let's also provide dark mode alternatives
    bg: "surface.cards.default",
  },
});

const xlDialog = defineStyle({
  px: "standard.xl",
  py: "standard.xl",
  width: "100%",
  maxWidth: "446px",
  borderRadius: "standard.lg",
});

const mdDialog = defineStyle({
  px: "standard.md",
  py: "standard.md",
  width: "100%",
  maxWidth: "446px",
  borderRadius: "standard.lg",
});

const mdBody = defineStyle({
  px: "standard.md",
  py: "standard.md",
  minHeight: "auto"
});
const xlBody = defineStyle({
  minHeight: "272px"
});
const sm = defineStyle({
  fontSize: "sm",
  py: "6",
});

const sizes = {
  standard: definePartsStyle({ header: sm, dialog: xlDialog, body: xlBody }),
  md: definePartsStyle({ header: sm, dialog: mdDialog, body: mdBody }),
};

export const modalTheme = defineMultiStyleConfig({
  baseStyle: {
    dialog: {
      boxShadow: "0px 9px 30px 0px rgba(51, 51, 62, 0.08), 1px 2px 2px 0px rgba(51, 51, 62, 0.10)",
      background: "surface.cards.default"
    },
    overlay: {
      bg: "surface.overlay"
    },
    header: {
      p: 0
    }
  },
  variants: { primary },
  sizes,
  defaultProps: {
    variant: "primary",
    size: "standard",
  },
});
