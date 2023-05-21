import { Box } from '@chakra-ui/react';
import React from 'react';

type Props = {
  children?: React.ReactNode;
};

export const ListRowContainer = ({ children }: Props) => {
  return (
    <Box
      mt="24px"
      display="flex"
      flexDirection="column"
      borderTop="1px solid #ECEDEE"
    >
      {children}
    </Box>
  );
};
