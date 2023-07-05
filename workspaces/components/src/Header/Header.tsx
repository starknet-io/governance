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
      height="72px"
      borderBottom="1px solid #E4E5E7"
      px="32px"
      bg="#F9F8F9"
    >
      {props.children}
    </Box>
  );
};
