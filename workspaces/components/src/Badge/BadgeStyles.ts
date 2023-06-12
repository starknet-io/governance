import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const last_call = defineStyle({
  background: "#FEE7EB",
  color: "#D90C31",
  borderColor: "rgba(217, 12, 49, 0.1)",
});
const active = defineStyle({
  background: "#D4F7E8",
  color: "#187C52",
  borderColor: "rgba(32, 162, 107, 0.12)",
});
const Draft = defineStyle({
  background: "#D4F7E8",
  color: "#187C52",
  borderColor: "rgba(32, 162, 107, 0.12)",
});
const pending = defineStyle({
  background: "#F2F2F3",
  color: "#6C6C75",
  borderColor: "rgba(114, 113, 122, 0.16)",
});
const review = defineStyle({
  background: "#F2F2F3",
  color: "#6C6C75",
  borderColor: "rgba(114, 113, 122, 0.16)",
});

export const badgeTheme = defineStyleConfig({
  baseStyle: {
    paddingLeft: "8px",
    paddingRight: "8px",
    borderRadius: "3px",
    height: "auto",
    color: "#fff",
    fontSize: "11px",
    fontWeight: "medium",
    textTransform: "uppercase",
    borderWidth: "1px",
    borderStyle: "solid",
  },
  variants: {
    last_call,
    active,
    pending,
    review,
    Draft,
  },
});
