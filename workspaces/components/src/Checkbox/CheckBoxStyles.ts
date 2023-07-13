import { checkboxAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  label: {
    // fontSize: "10px",
  },
  control: {
    // padding: 3, // change the padding of the control
    // borderRadius: 0, // change the border radius of the control
  },
});
const sizes = {
  sm: definePartsStyle({
    control: defineStyle({
      boxSize: "18px",
      borderRadius: "4px",
    }),
    label: defineStyle({
      fontSize: "14px",
      marginLeft: "12px",
      fontWeight: "400",
    }),
  }),
};

export const checkboxTheme = defineMultiStyleConfig({ baseStyle, sizes });
