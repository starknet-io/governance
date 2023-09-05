import { Box, Flex } from "@chakra-ui/react";

type Props = {
  children?: React.ReactNode;
};

const Root = (props: Props) => {
  return (
    <Box
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      alignItems={{ base: "flex-start", md: "center" }}
      justifyContent="flex-start"
      gap={{ base: "16px", md: "12px" }}
      mb="24px"
    >
      {props.children}
    </Box>
  );
};

export interface GroupProps {
  children?: React.ReactNode;
  gap?: string;
  alignEnd?: boolean;
  mobileDirection?: "column" | "row"; // Renamed prop for mobile direction
}

const Group = ({
  children,
  gap = "12px",
  alignEnd,
  mobileDirection = "column", // Default to "column" for mobile
}: GroupProps) => {
  return (
    <Flex
      width={{ base: "100%", md: "auto" }}
      flexDirection={{ base: mobileDirection, md: "row" }}
      alignItems={{
        base: mobileDirection === "row" ? "center" : "flex-start",
        md: "center",
      }}
      gap={gap}
      marginLeft={alignEnd ? "auto" : "0"}
    >
      {children}
    </Flex>
  );
};

export { Root, Group };
