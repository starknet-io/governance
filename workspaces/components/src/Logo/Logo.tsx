import { Box } from '@chakra-ui/react';
import { Heading } from 'src/Heading';

type Props = {};

export const Logo = (props: Props) => {
  return (
    <Box
      height="88px"
      mt="-34px"
      display="flex"
      alignItems="center"
      paddingLeft="14px"
    >
      <Heading variant="h5">Starkware Cast</Heading>
    </Box>
  );
};
