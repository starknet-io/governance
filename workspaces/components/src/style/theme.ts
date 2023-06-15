import { theme as proTheme } from "@chakra-ui/pro-theme";
import { extendTheme } from "@chakra-ui/react";
import { styles } from "./global-styles";
import { buttonTheme as Button } from "../Button/ButtonStyles";
import { badgeTheme as Badge } from "../Badge/BadgeStyles";
import { textTheme as Text } from "../Text/TextStyles";
import { tagTheme as Tag } from "../Tag/TagStyles";
import { cardTheme as Card } from "../Card/CardStyles";
import { inputTheme as Input } from "../Input/InputStyles";
import { textareaTheme as Textarea } from "../Textarea/TextareaStyles";
import { iconButtonTheme as IconButton } from "../IconButton/IconButtonStyles";
import { ProgressTheme as Progress } from "../Progress/ProgressStyles";
import { modalTheme as Modal } from "../VoteModal/ModalStyles";
import { spinnerTheme as Spinner } from "../Spinner/SpinnerStyles";

const config = {
  initialColorMode: "light",
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
    Textarea,
    IconButton,
    Modal,
    Spinner,
    Checkbox: {
      baseStyle: {
        control: {
          _checked: {
            color: "#3b3b3b",
          },
        },
      },
    },
    Input,
    Progress,
  },
});

export default theme;
