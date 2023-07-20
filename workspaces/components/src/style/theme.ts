import { extendTheme } from "@chakra-ui/react";
import { styles } from "./global-styles";
import { buttonTheme as Button } from "../Button/ButtonStyles";
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

const config = {
  initialColorMode: "light",
};

const theme = extendTheme({
  config,
  components: {
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
    Checkbox: {
      baseStyle: {
        control: {
          _checked: {
            color: "#3b3b3b",
          },
        },
      },
    },
    fonts: {
      heading: `'Poppins', sans-serif`,
      body: `'Inter Variable', sans-serif`,
    },
    Input,
    Progress,
    styles,
  },
});

export default theme;
