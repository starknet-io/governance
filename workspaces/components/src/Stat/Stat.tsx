import {
  Badge,
  Box,
  Stack,
  Link as ChakraLink,
  Button as ChakraButton,
} from "@chakra-ui/react";
import { Text as ChakraText } from "../Text";
import moment from "moment";
import { truncateAddress } from "src/utils";

// interface Props {
//   label: string | null;
//   value?: string | null;
//   component?: React.ReactNode;
// }

interface RootProps {
  children?: React.ReactNode;
}
const Root = ({ children }: RootProps) => {
  return (
    <Box>
      <Stack>{children}</Stack>
    </Box>
  );
};
interface LabelProps {
  children?: React.ReactNode;
}
const Label = ({ children }: LabelProps) => {
  return <ChakraText variant="breadcrumbs">{children}</ChakraText>;
};

interface StatusProps {
  status?:
    | "Draft"
    | "Review"
    | "Last Call"
    | "Final"
    | "Stagnant"
    | "Withdrawn"
    | "Living"
    | "closed"
    | null
    | string;
}
const Status = ({ status }: StatusProps) => {
  return (
    <Badge size="xs" variant={`${status}`}>
      {`${status}`}
    </Badge>
  );
};

interface TextProps {
  label: string | null | undefined;
}
const Text = ({ label }: TextProps) => {
  const displayLabel =
    label && label.startsWith("By 0x") ? truncateAddress(label) : label;

  return (
    <ChakraText variant="breadcrumbs" fontWeight="500" color="#4D4D56">
      {displayLabel}
    </ChakraText>
  );
};

// use date type and format with moment
interface DateProps {
  date?: Date;
}
const Date = ({ date }: DateProps) => {
  const formattedDate = moment(date).format(
    "MMMM Do YYYY"
  );
  return (
    <ChakraText variant="breadcrumbs" fontWeight="500" color="#4D4D56">
      {date && formattedDate}
    </ChakraText>
  );
};

interface LinkProps {
  label: string | null | undefined;
}
const Link = ({ label }: LinkProps) => {
  return (
    <ChakraLink
      fontWeight="500"
      fontSize="12px"
      padding="0"
      color="#4D4D56"
      href="#sdf"
    >
      {label}
    </ChakraLink>
  );
};
interface ButtonProps {
  label: string | null | undefined;
  onClick?: () => void;
}
const Button = ({ label, onClick }: ButtonProps) => {
  return (
    <ChakraButton
      variant="ghost"
      onClick={onClick}
      fontWeight="500"
      fontSize="12px"
      padding="0"
      color="#4D4D56"
    >
      {label}
    </ChakraButton>
  );
};

export { Root, Label, Status, Text, Date, Link, Button };
