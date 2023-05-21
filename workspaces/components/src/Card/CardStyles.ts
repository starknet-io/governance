import { cardAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  container: {
    borderRadius: '8px',
  },
  header: {
    paddingBottom: '12px',
  },
  body: {
    paddingTop: '2px',
  },
  footer: {
    paddingTop: '2px',
  },
});

export const cardTheme = defineMultiStyleConfig({ baseStyle });
