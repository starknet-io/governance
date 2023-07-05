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
    padding: "4px",
    borderRadius: "4px",
    border: "1px solid var(--border-forms, rgba(26, 21, 35, 0.09))",
    bg: "hsla(300, 8%, 97%, 1)",
    boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.04)",
  },

  item: {
    // this will style the MenuItem and MenuItemOption components
    color: "hsla(261, 25%, 11%, 1)",
    bg: "hsla(300, 8%, 97%, 1)",
    borderRadius: "4px",
    _hover: {
      bg: "hsla(255, 4%, 57%, 0.06)",
    },
    _focus: {
      bg: "hsla(255, 4%, 57%, 0.06)",
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
