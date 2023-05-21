import { theme as proTheme } from '@chakra-ui/pro-theme';
import { extendTheme } from '@chakra-ui/react';
import { styles } from './global-styles';
import { buttonTheme as Button } from '../Button/ButtonStyles';
import { badgeTheme as Badge } from '../Badge/BadgeStyles';
import { textTheme as Text } from '../Text/TextStyles';
import { tagTheme as Tag } from '../Tag/TagStyles';
import { cardTheme as Card } from '../Card/CardStyles';

const config = {
  initialColorMode: 'light',
};

const theme = extendTheme(proTheme, {
  config,
  styles,
  components: {
    Button,
    Badge,
    Text,
    Tag,
    Card,
  },
});

export default theme;
