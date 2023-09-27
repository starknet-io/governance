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

const xl = defineStyle({
  px: "standard.xl",
  py: "standard.xl",
  width: "100%",
  maxWidth: "446px",
  borderRadius: "standard.lg",
});

const sm = defineStyle({
  fontSize: "sm",
  py: "6",
});
const bodySm = defineStyle({});

const sizes = {
  standard: definePartsStyle({ header: sm, dialog: xl, body: bodySm }),
};

export const modalTheme = defineMultiStyleConfig({
  variants: { primary },
  sizes,
  defaultProps: {
    variant: "primary",
    size: "standard",
  },
});
