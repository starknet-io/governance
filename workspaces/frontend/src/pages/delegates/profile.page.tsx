import { DocumentProps } from 'src/renderer/types';

import {
  Avatar,
  Box,
  Button,
  Heading,
  Stack,
  Tag,
  Text,
} from '@yukilabs/governance-components';

export function Page() {
  return (
    <Box display="flex" flexDirection="row">
      <Box minWidth="300px">
        <Stack spacing="24px" direction={{ base: 'column' }}>
          <Box display="flex" alignItems="center" gap="16px">
            <Avatar
              size="md"
              src="https://pbs.twimg.com/profile_images/1573727826523693063/HiGqLypz_400x400.jpg"
            />
            <Heading variant="h3">onlydust.eth</Heading>
          </Box>
          <Box>
            <Tag variant="listCard">Builder</Tag>
          </Box>
          <Box>
            <Button variant="outline">Delegate votes</Button>
          </Box>
          <Box>
            <Button variant="outline">Edit delegate profile</Button>
          </Box>
        </Stack>
      </Box>
      <Box flex="1">
        <Stack spacing="24px" direction={{ base: 'column' }}>
          <Heading variant="h3">Delegate statement</Heading>
          <Text variant="body">
            I’m the co-founder of OnlyDust and I’m in charge of the
            whole product team and our dev rels team.
          </Text>
          <Text variant="body">
            Our goal is to grow the Starknet ecosystem and make sure
            that everyone can contribute and make a difference in this
            ecosystem. Our main focus is to onboard new devs and
            retain them on Starknet by helping them contribute to the
            best open source projects.
          </Text>
          <Text variant="body">
            Let’s Keep Starknet Strange together.
          </Text>
        </Stack>
      </Box>
    </Box>
  );
}

export const documentProps = {
  title: 'Delegates / profile',
} satisfies DocumentProps;
