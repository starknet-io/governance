import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const outline = defineStyle({
  borderRadius: '6px',
  fontWeight: 'medium',
  fontSize: '13px',
  paddingLeft: '40px',
  paddingRight: '40px',
  color: '#33333E',
  borderColor: '#E4E5E7',
  bg: 'transparent',
  minWidth: 'none',
  lineHeight: '24px',
  height: 'auto',
  padding: '4px 10px',
  _hover: {
    bg: 'transparent',
    color: 'btn-outline-hover-fg',
    borderColor: '#ccc',
    _dark: {
      color: 'selected.100',
    },
  },
  _active: {
    bg: 'bg.200',
    color: 'grey.greyDusk',
    borderColor: 'grey.morning',
    borderWidth: '1px',
    boxShadow: 'inset 0px 4px 0px rgba(0, 0, 0, 0.1)',
    outlineWidth: 1,
    _focus: {
      bg: 'bg.200',
      color: 'grey.greyDusk',
      borderColor: 'grey.morning',
      borderWidth: '1px',
      boxShadow: 'inset 0px 4px 0px rgba(0, 0, 0, 0.1)',
      outlineWidth: 1,
    },
    _dark: {
      bg: 'black',
      color: 'grey.greyDusk',
      borderColor: 'grey.greyDusk',
      outlineWidth: 1,
      _focus: {
        bg: 'black',
        color: 'grey.greyDusk',
        borderColor: 'grey.greyDusk',
        outlineWidth: 1,
      },
    },
  },
  _focus: {
    boxShadow: 'none',
    borderColor: 'selected.main',
    _dark: {
      boxShadow: 'none',
      borderColor: 'selected.100',
      borderWidth: '1px',
      borderStyle: 'solid',
    },
  },
  _dark: {
    border: '1px solid grey.greyDusk',
    color: 'white',
  },
});

export const buttonTheme = defineStyleConfig({
  variants: {
    outline,
  },
});
