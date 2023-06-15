import { modalAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const purple = definePartsStyle({
  dialog: {
    borderRadius: "md",
    bg: `purple.100`,

    // Let's also provide dark mode alternatives
    _dark: {
      bg: `purple.600`,
      color: "white",
    },
  },
});

export const modalTheme = defineMultiStyleConfig({
  variants: { purple },
});
