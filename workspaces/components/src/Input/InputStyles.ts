import { inputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

const primary = definePartsStyle({
  field: {
    _placeholder: {
      color: '#93939F',
    },
    borderRadius: '5px',
    background: '#FFFFFF',
    fontSize: '14px',
    border: '1px solid #E4E5E7',

    boxShadow: '0px 1px 1px rgba(228, 229, 231, 0.5)',

    // Let's also provide dark mode alternatives
  },
  addon: {
    border: '1px solid',
    borderColor: 'gray.200',
    background: 'gray.200',
    borderRadius: 'full',
    color: 'gray.500',
  },
});
export const inputTheme = defineMultiStyleConfig({
  variants: { primary },
});
