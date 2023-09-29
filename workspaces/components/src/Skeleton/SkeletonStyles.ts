import { defineStyle, defineStyleConfig, cssVar } from "@chakra-ui/react";

const $startColor = cssVar("skeleton-start-color");
const $endColor = cssVar("skeleton-end-color");

const red = defineStyle({
  [$startColor.variable]: "#ccc",
  [$endColor.variable]: "#eee",
  opacity: 0.4,
});

const xl = defineStyle({
  h: 9,
  borderRadius: "4px",
});
export const skeletonTheme = defineStyleConfig({
  defaultProps: {
    size: "xl",
    variant: "red",
  },
  variants: { red },
  sizes: { xl },
});
