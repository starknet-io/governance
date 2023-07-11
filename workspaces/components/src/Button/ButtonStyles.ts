import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const outline = defineStyle({
  borderRadius: "4px",
  fontWeight: "medium",
  fontSize: "13px",
  paddingLeft: "40px",
  paddingRight: "40px",
  color: "#33333E",
  borderColor: "#E4E5E7",
  bg: "transparent",
  minWidth: "none",
  lineHeight: "24px",
  height: "auto",
  padding: "4px 10px",
  boxShadow: " 0px 2px 2px rgba(0, 0, 0, 0.04)",
  _hover: {
    bg: "transparent",
    color: "btn-outline-hover-fg",
    borderColor: "#ccc",
    _dark: {
      color: "selected.100",
    },
  },
  _active: {
    bg: "bg.200",
    color: "grey.greyDusk",
    borderColor: "grey.morning",
    borderWidth: "1px",
    // boxShadow: 'inset 0px 4px 0px rgba(0, 0, 0, 0.1)',
    outlineWidth: 1,
    _focus: {
      bg: "bg.200",
      color: "grey.greyDusk",
      borderColor: "grey.morning",
      borderWidth: "1px",
      // boxShadow: 'inset 0px 4px 0px rgba(0, 0, 0, 0.1)',
      outlineWidth: 1,
    },
    _dark: {
      bg: "black",
      color: "grey.greyDusk",
      borderColor: "grey.greyDusk",
      outlineWidth: 1,
      _focus: {
        bg: "black",
        color: "grey.greyDusk",
        borderColor: "grey.greyDusk",
        outlineWidth: 1,
      },
    },
  },
  _focus: {
    boxShadow: "none",
    borderColor: "selected.main",
    _dark: {
      boxShadow: "none",
      borderColor: "selected.100",
      borderWidth: "1px",
      borderStyle: "solid",
    },
  },
});
const solid = defineStyle({
  bg: "#141417",
  h: "36px",
  borderRadius: "4px",
  color: "#fff",
  _hover: {
    bg: "#444",
  },
  _active: {
    outlineWidth: 1,
  },
  _disabled: {
    bg: "#444",
    color: "#fff",
    opacity: 1,
    pointerEvents: "none",
    _hover: {
      bg: "#444",
      color: "#fff",
      opacity: 1,
    },
  },

  _focus: {
    boxShadow: "none",
    borderColor: "selected.main",
    borderWidth: "1px",
    borderStyle: "solid",
  },
});
const switcher = defineStyle({
  bg: "transparent",
  h: "32px",
  borderRadius: "6px",
  color: "#6C6C75",
  fontSize: "12px",
  fontWeight: "500",
  boxShadow: "0px 1px 1px rgba(0, 0, 0, 0)",

  _hover: {
    bg: "transparent",
    color: "#292932",
  },
  _active: {
    bg: "#FFFFFF",
    border: "0.5px solid #EEEEF1",
    boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.07)",
    color: "#292932",
    fontWeight: "500",
  },
  _disabled: {
    bg: "#444",
    color: "#fff",
    opacity: 1,
    pointerEvents: "none",
    _hover: {
      bg: "#444",
      color: "#fff",
      opacity: 1,
    },
  },

  _focus: {
    boxShadow: "none",
    borderColor: "selected.main",
    borderWidth: "1px",
    borderStyle: "solid",
  },
});
const toolbar = defineStyle({
  bg: "white",
  borderRadius: "4px",

  _hover: {
    bg: "hsla(253, 4%, 54%, 0.12)",
  },
  _active: {
    outlineWidth: 1,
    backgroundColor: "hsla(247, 4%, 45%, 1)",
    color: "#fff",
  },
  _disabled: {
    bg: "#444",
    color: "#fff",
    opacity: 1,
    pointerEvents: "none",
    _hover: {
      bg: "#444",
      color: "#fff",
      opacity: 1,
    },
  },

  _focus: {
    boxShadow: "none",
    borderColor: "selected.main",
    borderWidth: "1px",
    borderStyle: "solid",
  },
});

const sizes = {
  sm: defineStyle({
    fontSize: "sm",
    borderRadius: "4px",
    px: "14px",
    fontWeight: "500", // Change font size to sm (14px)
  }),
  tb: defineStyle({
    fontSize: "20px",
    width: "32px",
    height: "32px",
  }),
};

const fullGhostBtn = defineStyle({
  w: "100%",
  bg: "transparent",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "#1A152317",
  color: "#6F6E77",
  fontWeight: "500",
  borderRadius: "4px",
  boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.07)",
  _focus: {
    boxShadow: "none",
    borderColor: "selected.main",
    borderWidth: "1px",
    borderStyle: "solid",
  },
  _hover: {
    background: "gray.100",
  },
  _active: {
    background: "gray.200",
  }
});

export const buttonTheme = defineStyleConfig({
  sizes,
  variants: {
    outline,
    solid,
    switcher,
    toolbar,
    fullGhostBtn
  },
});
