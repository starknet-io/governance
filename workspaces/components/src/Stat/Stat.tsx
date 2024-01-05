import {
  Badge,
  Box,
  Stack,
  Link as ChakraLink,
  Button as ChakraButton,
  LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";
import { Text as ChakraText } from "../Text";
import { format } from "date-fns";
import { truncateAddress } from "#src/utils";

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
    <ChakraText
      variant="small"
      fontWeight="500"
      color="content.default.default"
    >
      {displayLabel}
    </ChakraText>
  );
};

// use date type and format with moment
interface DateProps {
  date?: Date;
}
const Date = ({ date }: DateProps) => {
  if (!date) {
    return null; // or return <ChakraText>Default Message</ChakraText>;
  }

  const formattedDate = format(date, "MMM do yyyy");
  return (
    <ChakraText
      variant="small"
      fontWeight="500"
      color="content.default.default"
    >
      {date && formattedDate}
    </ChakraText>
  );
};

interface LinkProps extends ChakraLinkProps {
  label: string | null | undefined;
}
const Link = ({ label, href }: LinkProps) => {
  return (
    <ChakraLink href={href} variant="unstyled" lineHeight="20px" padding="0">
      <ChakraText
        variant="small"
        fontWeight="500"
        color="content.default.default"
      >
        {label}
      </ChakraText>
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
