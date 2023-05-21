import { Avatar, Box } from '@chakra-ui/react';

import { Text } from 'src/Text';

type Props = {
  address: string;
};

export const Connected = (props: Props) => {
  return (
    <Box
      as="button"
      display="flex"
      flexDirection="row"
      padding="8px 14px 8px 10px"
      borderRadius="75px"
      alignItems={'center'}
      gap="8px"
      bg="#F4F4F6"
      _hover={{
        backgroundColor: '#ECEDEE',
      }}
    >
      <Avatar
        width="20px"
        height="20px"
        bg="#D237EB"
        name="robwalsh.eth"
        color="#D237EB"
        pointerEvents={'none'}
      />
      <Text fontWeight="500" color="#6B6B80" variant="breadcrumbs">
        {props.address}
      </Text>
    </Box>
  );
};
