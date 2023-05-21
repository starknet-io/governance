import { Box } from '@chakra-ui/react';

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
      height="88px"
    >
      {props.children}
    </Box>
  );
};
