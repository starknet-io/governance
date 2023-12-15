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
  gap: "standard.xl"
});

const mdDialog = defineStyle({
  px: "standard.xl",
  py: "standard.xl",
  width: "100%",
  maxWidth: "446px",
  borderRadius: "standard.lg",
  gap: "standard.md"
});

const mdBody = defineStyle({
  display: "flex",
  flexDirection: "column",
  px: "standard.xl",
  py: "standard.xl",
  gap: "standard.md"
});
const xlBody = defineStyle({
  display: "flex",
  flexDirection: "column",
  gap: "standard.xl"
});

const sizes = {
  standard: definePartsStyle({ dialog: xlDialog, body: xlBody }),
  md: definePartsStyle({ dialog: mdDialog, body: mdBody }),
  sm: definePartsStyle({ dialog: xlDialog, body: xlBody }),
  smBodyMd: definePartsStyle({ dialog: mdDialog, body: mdDialog }),
};

export const modalTheme = defineMultiStyleConfig({
  baseStyle: {
    dialog: {
      boxShadow: "0px 9px 30px 0px rgba(51, 51, 62, 0.08), 1px 2px 2px 0px rgba(51, 51, 62, 0.10)",
      background: "surface.cards.default",
      marginInlineStart: '0 !important',
      marginInlineEnd: '0 !important',
      // '@media (max-width: 768px)': {
      //   width: '100vw',
      //   maxW: '100vw',
      //   h: '100vh',
      //   maxH: '100vh',
      //   margin: 0,
      //   borderRadius: 0
      // },
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
