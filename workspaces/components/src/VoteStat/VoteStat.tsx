import { AvatarBadge, Box, HStack, Stack } from '@chakra-ui/react';

import { Text } from '../Text';

export const VoteStat = () => {
  return (
    <Stack fontSize="sm" px="4" spacing="4">
      <Stack direction="row" justify="space-between" spacing="4">
        <HStack spacing="3">
          <Box>
            <Text fontWeight="medium" color="black">
              sylve.eth
            </Text>
          </Box>
          <Text color="black">10.5B votes</Text>
        </HStack>
      </Stack>
      <Text
        color="black"
        sx={{
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
          overflow: 'hidden',
          display: '-webkit-box',
        }}
      >
        The Builder’s council is excited about the new features but
        expects higher quality of documentation for future releases.
        For this reason the council has voted against...
      </Text>
    </Stack>
  );
};
