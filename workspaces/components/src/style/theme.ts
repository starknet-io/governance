import { extendTheme } from "@chakra-ui/react";
import { styles } from "./global-styles";
import { buttonTheme as Button } from "../Button/ButtonStyles";
import { headingTheme as Heading } from "../Heading/HeadingStyles";
import { badgeTheme as Badge } from "../Badge/BadgeStyles";
import { textTheme as Text } from "../Text/TextStyles";
import { tagTheme as Tag } from "../Tag/TagStyles";
import { cardTheme as Card } from "../Card/CardStyles";
import { inputTheme as Input } from "../Input/InputStyles";
import { textareaTheme as Textarea } from "../Textarea/TextareaStyles";
import { ProgressTheme as Progress } from "../Progress/ProgressStyles";
import { modalTheme as Modal } from "../VoteModal/ModalStyles";
import { spinnerTheme as Spinner } from "../Spinner/SpinnerStyles";
import { menuTheme } from "src/Menu/MenuStyles";
import { linkTheme } from "src/Link/LinkStyles";
import { skeletonTheme } from "src/Skeleton/SkeletonStyles";
import { colors, spacing, radii } from "./tokens";
import { checkboxTheme } from "src/Checkbox/CheckboxStyles";
import { radioTheme } from "src/Radio/RadioStyles";
import { switchTheme } from "src/Switch/SwitchStyles";
import { alertTheme } from "src/Banner/AlertStyles";
import { dividerTheme } from "src/Divider/DividerStyles";

const config = {
  initialColorMode: "light",
};

export const theme = extendTheme({
  config,
  colors: {
    ...colors,
  },

  space: {
    ...spacing,
  },
  radii: {
    ...radii,
  },
  sizes: {
    ...spacing,
  },

  components: {
    Skeleton: skeletonTheme,
    Alert: alertTheme,
    Button,
    Badge,
    Text,
    Tag,
    Card,
    Link: linkTheme,
    Textarea,
    Menu: menuTheme,
    Modal,
    Spinner,
    Divider: dividerTheme,

    fonts: {
      heading: `'Poppins', sans-serif`,
      body: `'Inter Variable', sans-serif`,
    },
    Input,
    Progress,
    styles,

    Heading,
    Checkbox: checkboxTheme,
    Radio: radioTheme,
    Switch: switchTheme,
  },
});
