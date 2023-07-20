import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const last_call = defineStyle({
  background: "#FEE7EB",
  color: "#D90C31",
  borderColor: "rgba(217, 12, 49, 0.1)",
});
const active = defineStyle({
  background: "#90EAC4",
  color: "#16412F",
});
const Draft = defineStyle({
  background: "#3F8CFF",
  color: "#fff",
});
const pending = defineStyle({
  background: "#DCDBDD",
  color: "#1A1523",
});
const review = defineStyle({
  background: "#F2F2F3",
  color: "#fff",
});
const closed = defineStyle({
  background: "#E799FF",
  color: "#3F0053",
});

export const badgeTheme = defineStyleConfig({
  baseStyle: {
    paddingLeft: "16px",
    paddingRight: "16px",
    paddingTop: "4px",
    paddingBottom: "4px",
    borderRadius: "999px",
    height: "auto",
    color: "#3F0053",
    fontSize: "11px",
    fontWeight: "500",
    textTransform: "uppercase",
    borderWidth: "0px",
    borderStyle: "solid",
  },
  variants: {
    last_call,
    active,
    pending,
    review,
    Draft,
    closed,
  },
});
