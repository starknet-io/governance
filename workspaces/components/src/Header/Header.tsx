import { Box } from "@chakra-ui/react";

type Props = {
  children?: React.ReactNode;
};

export const Header = (props: Props) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-start"
      height="68px"
      borderBottom="1px solid"
      borderColor="border.forms"
      px={{ base: "standard.xs", lg: "spacing-md" }}
      bg="surface.bgPage"
    >
      {props.children}
    </Box>
  );
};
