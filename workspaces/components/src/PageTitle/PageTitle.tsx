import { Box } from '@chakra-ui/react';
import { Heading } from 'src/Heading';

type Props = {
  title: string;
};

export const PageTitle = ({ title }: Props) => {
  return (
    <Box marginBottom="24px">
      <Heading as="h2" variant="h3">
        {title}
      </Heading>
    </Box>
  );
};
