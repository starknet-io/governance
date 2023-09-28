import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const success = defineStyle({
  filledTrack: {
    backgroundColor: "surface.success.default",
  },
});
const danger = defineStyle({
  filledTrack: {
    backgroundColor: "surface.danger.default",
  },
});
const neutral = defineStyle({
  filledTrack: {
    backgroundColor: "surface.accentSecondary.default",
  },
});

export const ProgressTheme = defineStyleConfig({
  baseStyle: {
    filledTrack: {
      backgroundColor: "surface.success.default",
      borderRadius: "999px",
    },
    track: {
      backgroundColor: "#E7E8E9",
    },
  },
  variants: {
    success,
    danger,
    neutral,
  },
});
