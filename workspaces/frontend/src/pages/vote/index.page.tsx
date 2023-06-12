import { DocumentProps } from 'src/renderer/types';

import {
  Badge,
  Box,
  ContentContainer,
  Divider,
  Flex,
  Heading,
  Stack,
  Stat,
  SummaryItems,
  Text,
  VoteStat,
} from '@yukilabs/governance-components';

export function Page() {
  return (
    <Box
      display="flex"
      flexDirection={{ base: 'column', md: 'row' }}
      flex="1"
      height="100%"
    >
      <ContentContainer>
        <Box width="100%" maxWidth="662px" pb="200px" mx="auto">
          <Stack
            spacing="24px"
            direction={{ base: 'column' }}
            color="#545464"
          >
            <Heading color="#33333E" variant="h3">
              Support for scoped storage variables
            </Heading>

            <Flex justifyContent="space-between" paddingTop="24px">
              <Stat label="Type" value="SNIP proposal" />
              <Stat
                label="Status"
                component={
                  <Badge size="xs" variant={'active'}>
                    active
                  </Badge>
                }
              />
              <Stat
                label="Start date"
                value="Jun 25, 2023, 5:00 PM"
              />
              <Stat label="End date" value="Jun 25, 2023, 5:00 PM" />
            </Flex>
            <Divider />
            <Heading color="#33333E" variant="h3">
              Overview
            </Heading>
            <Text variant="body">
              Namespaces are a very powerful (although undocumented)
              way to write Cairo modules. It allows scoping function
              definitions under an identifier 17, helping prevent
              collisions when importing functions from multiple
              modules.
            </Text>
            <Text variant="body">
              Nevertheless, the current implementation does not allow
              to scope storage variables (or functions representing
              them) within namespaces, opening the door for storage
              collisions in the case of two modules defining the same
              storage variable
            </Text>
            <Text variant="body">
              Namespaces are a very powerful (although undocumented)
              way to write Cairo modules. It allows scoping function
              definitions under an identifier 17, helping prevent
              collisions when importing functions from multiple
              modules.
            </Text>
            <Heading color="#33333E" variant="h3">
              Next up
            </Heading>
            <Text variant="body">
              Namespaces are a very powerful (although undocumented)
              way to write Cairo modules. It allows scoping function
              definitions under an identifier 17, helping prevent
              collisions when importing functions from multiple
              modules.
            </Text>
            <Heading color="#33333E" variant="h3">
              Review
            </Heading>
            <Text variant="body">
              Namespaces are a very powerful (although undocumented)
              way to write Cairo modules. It allows scoping function
              definitions under an identifier 17, helping prevent
              collisions when importing functions from multiple
              modules.
            </Text>
            <Text variant="body">
              Let’s Keep Starknet Strange together.
            </Text>
          </Stack>
        </Box>
      </ContentContainer>
      <Box
        pt="40px"
        px="32px"
        borderRight="1px solid #E7E8E9"
        display="flex"
        flexDirection="column"
        flexBasis={{ base: '100%', md: '391px' }}
        height="100%"
      >
        <Divider />
        <VoteStat />
        <SummaryItems.Root>
          <SummaryItems.Title label="Vote information" />
          <SummaryItems.Item label="Stategies" value="Type" />
          <SummaryItems.Item label="IPFS" value="#dfbv892379" />
          <SummaryItems.Item
            label="Voting system"
            value="Single choice vote"
          />
          <SummaryItems.Item label="Snapshot" value="1,845,023" />
        </SummaryItems.Root>
      </Box>
    </Box>
  );
}

export const documentProps = {
  title: 'Proposals / snip',
} satisfies DocumentProps;
