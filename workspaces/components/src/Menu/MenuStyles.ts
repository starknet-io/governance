import { menuAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys);

// define the base component styles
const baseStyle = definePartsStyle({
  // define the part you're going to style
  button: {
    // this will style the MenuButton component
    fontWeight: "medium",
    bg: "#fff",
    color: "hsla(261, 25%, 11%, 1)",

    _hover: {
      bg: "#444",
      color: "white",
    },
  },
  list: {
    // this will style the MenuList component
    padding: "standard.base",
    borderRadius: "standard.base",
    border: "1px solid",
    borderColor: "border.forms",
    bg: "surface.forms.default",
    boxShadow:
      "0px 9px 30px 0px rgba(51, 51, 62, 0.08), 1px 2px 2px 0px rgba(51, 51, 62, 0.10)",
    zIndex: "10000",
  },

  item: {
    // this will style the MenuItem and MenuItemOption components
    color: "content.accent.default",
    fontSize: "14px",
    bg: "transparent",
    borderRadius: "standard.base",
    fontFamily: "Inter variable",
    fontWeight: "400",
    letterSpacing: "0.07px",
    _hover: {
      bg: "surface.forms.hover",
      color: "content-accent-default",
    },
    _selected: {
      bg: "surface.forms.hover",
      color: "content-accent-default",
    },
    _focus: {
      bg: "surface.forms.hover",
      color: "content-accent-default",
    },
    _active: {
      bg: "surface.forms.hover",
      color: "content-accent-default",
    },
  },
  groupTitle: {
    // this will style the text defined by the title prop
    // in the MenuGroup and MenuOptionGroup components
    textTransform: "uppercase",
    color: "white",
    textAlign: "center",
    letterSpacing: "wider",
    opacity: "0.7",
  },
  command: {
    // this will style the text defined by the command
    // prop in the MenuItem and MenuItemOption components
    opacity: "0.8",
    fontFamily: "mono",
    fontSize: "sm",
    letterSpacing: "tighter",
    pl: "4",
  },
  divider: {
    // this will style the MenuDivider component
    my: "4",
    borderColor: "white",
    borderBottom: "2px dotted",
  },
});
// export the base styles in the component theme
export const menuTheme = defineMultiStyleConfig({ baseStyle });
