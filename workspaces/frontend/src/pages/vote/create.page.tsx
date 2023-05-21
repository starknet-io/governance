import { DocumentProps } from 'src/renderer/types';

import {
  Box,
  AppBar,
  Button,
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Textarea,
  Stack,
  Select,
  Checkbox,
  InputGroup,
  InputLeftAddon,
} from '@yukilabs/governance-components';

export function Page() {
  return (
    <>
      <AppBar>
        <Box>
          <Box>
            <Button as="a" variant="outline" href="/">
              Back
            </Button>
          </Box>
        </Box>
      </AppBar>
      <Box>
        <Container maxWidth="lg" pb={'200px'}>
          <Heading variant="h3" mb="24px">
            Create voting proposal
          </Heading>
          <Stack spacing="32px" direction={{ base: 'column' }}>
            <FormControl id="title">
              <FormLabel>Title</FormLabel>
              <Input
                placeholder="Briefly describe proposal"
                onChange={(e) => console.log(e.target.value)}
              />
            </FormControl>
            <FormControl id="delegate-statement">
              <FormLabel>Proposal Body</FormLabel>
              <Textarea
                placeholder="#Preamble"
                onChange={(e) => console.log(e.target.value)}
              />
            </FormControl>
            <FormControl id="starknet-type">
              <FormLabel>Forum discussion (optional) </FormLabel>

              <InputGroup maxW={{ md: '3xl' }}>
                <InputLeftAddon>https://</InputLeftAddon>
                <Input defaultValue="community.starknet.io/1234567890" />
              </InputGroup>
            </FormControl>
            <FormControl id="starknet-wallet-address">
              <FormLabel>Voting type</FormLabel>
              <Select placeholder="Select option">
                <option value="option1">Single choice voting</option>
                <option value="option2">Degen</option>
                <option value="option3">Crypto math</option>
              </Select>
            </FormControl>

            <Button variant={'outline'}>Publish</Button>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export const documentProps = {
  title: 'Vote / Create',
} satisfies DocumentProps;
