import { Badge, Box, Stack } from "@chakra-ui/react";
import { Text as ChakraText } from "../Text";
import moment from "moment";

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
    | null;
}
const Status = ({ status }: StatusProps) => {
  return (
    <Badge size="xs" variant={"active"}>
      {`${status}`}
    </Badge>
  );
};

interface TextProps {
  label: string | null | undefined;
}
const Text = ({ label }: TextProps) => {
  return (
    <ChakraText fontWeight="bold" variant="breadcrumbs">
      <span style={{ textTransform: "uppercase" }}> {label}</span>
    </ChakraText>
  );
};

// use date type and format with moment
interface DateProps {
  timestamp?: string;
}
const Date = ({ timestamp }: DateProps) => {
  const formattedDate = moment(timestamp).format("MMMM Do YYYY, h:mm:ss a");
  return (
    <ChakraText fontWeight="bold" variant="breadcrumbs">
      {timestamp && formattedDate}
    </ChakraText>
  );
};
export { Root, Label, Status, Text, Date };
