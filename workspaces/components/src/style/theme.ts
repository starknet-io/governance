import { extendTheme } from "@chakra-ui/react";
import { styles } from "./global-styles";
import { buttonTheme as Button } from "../Button/ButtonStyles";
import { headingTheme as Heading } from "../Heading/HeadingStyles";
import { badgeTheme as Badge } from "../Badge/BadgeStyles";
import { textTheme as Text } from "../Text/TextStyles";
import { tagTheme as Tag } from "../Tag/TagStyles";
import { cardTheme as Card } from "../Card/CardStyles";
import { inputTheme as Input } from "../Input/InputStyles";
import { selectTheme as Select } from "../Select/SelectStyles";
import { textareaTheme as Textarea } from "../Textarea/TextareaStyles";
import { ProgressTheme as Progress } from "../Progress/ProgressStyles";
import { modalTheme as Modal } from "../Modal/ModalStyles";
import { spinnerTheme as Spinner } from "../Spinner/SpinnerStyles";
import { menuTheme } from "src/Menu/MenuStyles";
import { linkTheme } from "src/Link/LinkStyles";
import { skeletonTheme } from "src/Skeleton/SkeletonStyles";
import { colors, spacing, radii, baseColors } from "./tokens";
import { checkboxTheme } from "src/Checkbox/CheckboxStyles";
import { radioTheme } from "src/Radio/RadioStyles";
import { switchTheme } from "src/Switch/SwitchStyles";
import { alertTheme } from "src/Banner/AlertStyles";
import { dividerTheme } from "src/Divider/DividerStyles";
import { avatarTheme } from "src/Avatar/AvatarStyles";
import { FormTheme } from "src/FormControlled/Form";
import { tooltipTheme } from "src/Tooltip/TooltipStyles";

const config = {
  initialColorMode: "light",
};

export const theme = extendTheme({
  config,
  breakpoints: {
    sm: "23.4375rem", // 375px
    md: "52.125rem", // 834px
    lg: "67.5rem", // 1080px
    xl: "90.0rem", // 1440px
  },
  colors: {
    ...baseColors,
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
  styles: {
    ...styles,
  },

  components: {
    Avatar: avatarTheme,
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
    Select,
    ...FormTheme,
    Popover: {
      baseStyle: {
        content: {
          p: "standard.md"
        },
      },
    },
    fonts: {
      heading: `'Poppins', sans-serif`,
      body: `'Inter Variable', sans-serif`,
    },
    Input,
    Progress,

    Heading,
    Checkbox: checkboxTheme,
    Radio: radioTheme,
    Switch: switchTheme,
    Tooltip: tooltipTheme,
  },
});
