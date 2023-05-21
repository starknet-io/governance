import { tagAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tagAnatomy.keys);

const listCard = definePartsStyle({
  container: {
    px: '8px',
    py: '2px',
    background: '#F4F4F6',
    color: '#6B6B80',
    fontSize: '14px',
    borderRadius: '3px',
  },
});

export const tagTheme = defineMultiStyleConfig({
  variants: {
    listCard,
  },
});
