import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const success = defineStyle({
  filledTrack: {
    backgroundColor: "#20AC70",
  },
});
const danger = defineStyle({
  filledTrack: {
    backgroundColor: "#E1503E",
  },
});
const neutral = defineStyle({
  filledTrack: {
    backgroundColor: "#6C6C75",
  },
});

export const ProgressTheme = defineStyleConfig({
  baseStyle: {
    filledTrack: {
      backgroundColor: "#20AC70",
      borderRadius: "2px",
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
