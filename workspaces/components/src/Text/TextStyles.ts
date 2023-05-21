import { defineStyleConfig } from '@chakra-ui/react';

export const textTheme = defineStyleConfig({
  baseStyle: {
    fontWeight: '400',
  },
  variants: {
    cardBody: {
      fontSize: '15px',

      fontWeight: 400,
    },
    body: {
      fontSize: '16px',
      lineHeight: '32px',
      fontWeight: 400,
    },
    breadcrumbs: {
      fontSize: '12px',

      fontWeight: 400,

      cursor: 'pointer',
    },
    footerLink: {
      fontSize: '14px',
      lineHeight: '24px',
      fontWeight: 400,
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    textLink: {
      fontSize: '14px',
      lineHeight: '24px',
      fontWeight: 400,
      cursor: 'pointer',
      color: 'selected.main',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
});
