//toDo: remove older variations
import { defineStyleConfig } from "@chakra-ui/react";

export const textTheme = defineStyleConfig({
  baseStyle: {
    fontWeight: "400",
    fontFamily: "Inter Variable, sans-serif",
  },
  variants: {
    cardBody: {
      fontSize: "15px",
      fontWeight: 400,
    },
    body: {
      fontSize: "16px",
      lineHeight: "32px",
      fontWeight: 400,
    },
    bodySmall: {
      fontSize: "12px",
      lineHeight: "20px",
      fontWeight: 400,
    },
    bodySmallMedium: {
      fontSize: "12px",
      lineHeight: "20px",
      fontWeight: 500,
    },
    bodySmallStrong: {
      fontSize: "12px",
      lineHeight: "20px",
      fontWeight: 600,
    },
    bodyMedium: {
      fontSize: "14px",
      lineHeight: "20px",
      fontWeight: 400,
    },
    bodyMediumStrong: {
      fontSize: "14px",
      lineHeight: "20px",
      fontWeight: 600,
    },
    bodyLargeSoft: {
      fontSize: "15px",
      lineHeight: "24px",
      fontWeight: 400,
    },
    bodyLargeStrong: {
      fontSize: "15px",
      lineHeight: "24px",
      fontWeight: 600,
    },
    breadcrumbs: {
      fontSize: "12px",

      fontWeight: 400,

      cursor: "pointer",
    },
    footerLink: {
      fontSize: "14px",
      lineHeight: "24px",
      fontWeight: 400,
      cursor: "pointer",
      "&:hover": {
        textDecoration: "underline",
      },
    },
    textLink: {
      fontSize: "14px",
      lineHeight: "24px",
      fontWeight: 400,
      cursor: "pointer",
      color: "selected.main",
      "&:hover": {
        textDecoration: "underline",
      },
    },
    small: {
      fontSize: "0.75rem",
      lineHeight: "1.25rem",
      fontWeight: "500",
      letterSpacing: "0.12px",
    },
    smallStrong: {
      fontSize: "0.75rem",
      lineHeight: "1.25rem",
      fontWeight: "600",
      letterSpacing: "0.12px",
    },
    medium: { fontSize: "0.875rem", lineHeight: "1.25rem" },
    mediumStrong: {
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      fontWeight: "500",
    },
    large: { fontSize: "0.938rem", lineHeight: "1.5rem" },
    largeStrong: {
      fontSize: "0.938rem",
      lineHeight: "1.5rem",
      fontWeight: "600",
    },
    captionSmall: {
      fontSize: "0.625rem",
      lineHeight: "1rem",
      letterSpacing: "0.2px",
    },
    captionSmallStrong: {
      fontSize: "0.625rem",
      lineHeight: "1rem",
      fontWeight: "600",
      letterSpacing: "0.2px",
    },
    captionSmallUppercase: {
      fontSize: "0.625rem",
      lineHeight: "1rem",
      fontWeight: "600",
      letterSpacing: "0.2px",
      textTransform: "uppercase",
    },
  },
});
