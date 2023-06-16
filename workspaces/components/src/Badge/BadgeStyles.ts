import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const last_call = defineStyle({
  background: "#FEE7EB",
  color: "#D90C31",
  borderColor: "rgba(217, 12, 49, 0.1)",
});
const active = defineStyle({
  background: "#20AC70",
  color: "#fff",
});
const Draft = defineStyle({
  background: "#3F8CFF",
  color: "#fff",
});
const pending = defineStyle({
  background: "#F2F2F3",
  color: "#6C6C75",
});
const review = defineStyle({
  background: "#F2F2F3",
  color: "#fff",
});
const closed = defineStyle({
  background: "#7136ED",
  color: "#fff",
});

export const badgeTheme = defineStyleConfig({
  baseStyle: {
    paddingLeft: "8px",
    paddingRight: "8px",
    paddingTop: "4px",
    paddingBottom: "4px",
    borderRadius: "4px",
    height: "auto",
    color: "#fff",
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
