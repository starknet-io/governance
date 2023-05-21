import { Box } from '@chakra-ui/react';

type Props = {
  children?: React.ReactNode;
};

export const AppBar = (props: Props) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-start"
      mb="24px"
    >
      {props.children}
    </Box>
  );
};
