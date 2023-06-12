import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const primary = defineStyle({
  borderRadius: "5px",
  background: "#FFFFFF",
  fontSize: "14px",
  border: "1px solid #E4E5E7",

  boxShadow: "0px 1px 1px rgba(228, 229, 231, 0.5)",
  _placeholder: {
    color: "#93939F",
  },
});
const comment = defineStyle({
  borderRadius: "6px",
  background: "#F4F4F6",
  fontSize: "14px",
  border: "1px solid #E4E5E7",
  padding: "16px",

  // boxShadow: "0px 1px 1px rgba(228, 229, 231, 0.5)",
  _placeholder: {
    color: "#93939F",
  },
});

export const textareaTheme = defineStyleConfig({
  variants: { primary, comment },
});
