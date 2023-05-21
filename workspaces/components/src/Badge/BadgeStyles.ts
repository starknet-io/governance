import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const last_call = defineStyle({
  background: '#0D9BEC',
  color: '#fff',
});

export const badgeTheme = defineStyleConfig({
  baseStyle: {
    paddingLeft: '8px',
    paddingRight: '8px',
    borderRadius: '3px',
    height: '24px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 'medium',
    textTransform: 'none',
  },
  variants: {
    last_call,
  },
});
