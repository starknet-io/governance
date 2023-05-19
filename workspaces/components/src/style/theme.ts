import { theme as proTheme } from '@chakra-ui/pro-theme';
import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'light',
};

const theme = extendTheme(proTheme, {
  config,
});

export default theme;
