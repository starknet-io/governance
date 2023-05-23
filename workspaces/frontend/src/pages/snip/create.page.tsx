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
  Textarea,
  Stack,
  Select,
  Checkbox,
} from '@yukilabs/governance-components';

export function Page() {
  return (
    <>
      <AppBar>
        <Box>
          <Box>
            <Button as="a" variant="outline" href="/delegates">
              Back
            </Button>
          </Box>
        </Box>
      </AppBar>
      <Box>
        <Container maxWidth="lg" pb={'200px'}>
          <Heading variant="h3" mb="24px">
            Create Delegate
          </Heading>
          <Stack spacing="32px" direction={{ base: 'column' }}>
            <FormControl id="delegate-statement">
              <FormLabel>Delegate Statement</FormLabel>
              <Textarea
                placeholder="Enter your delegate statement here..."
                onChange={(e) => console.log(e.target.value)}
              />
            </FormControl>
            <FormControl id="starknet-type">
              <FormLabel>Starknet type</FormLabel>
              <Select placeholder="Select option">
                <option value="option1">Builder</option>
                <option value="option2">Degen</option>
                <option value="option3">Crypto math</option>
              </Select>
            </FormControl>
            <FormControl id="starknet-wallet-address">
              <FormLabel>Starknet wallet address</FormLabel>
              <Input
                placeholder="0x..."
                onChange={(e) => console.log(e.target.value)}
              />
            </FormControl>
            <FormControl id="twitter">
              {/* // idea to pull in their twitter avatar to use as delegate profile */}
              <FormLabel>Twitter</FormLabel>
              <Input
                placeholder="@yourhandle"
                onChange={(e) => console.log(e.target.value)}
              />
            </FormControl>
            <FormControl id="discord">
              <FormLabel>Discord</FormLabel>
              <Input
                placeholder="name#1234"
                onChange={(e) => console.log(e.target.value)}
              />
            </FormControl>
            <FormControl id="discourse">
              <FormLabel>Discourse</FormLabel>
              <Input
                placeholder="yourusername"
                onChange={(e) => console.log(e.target.value)}
              />
            </FormControl>
            <FormControl id="terms">
              <Checkbox defaultChecked={false}>
                Agree with delegate terms
              </Checkbox>
            </FormControl>
            <FormControl id="terms">
              <Checkbox required defaultChecked={false}>
                I understand the role of StarkNet delegates, we
                encourage all to read the Delegate Expectations 328;
                Starknet Governance announcements Part 1 98, Part 2
                44, and Part 3 34; The Foundation Post 60; as well as
                the Delegate Onboarding announcement 539 before
                proceeding.
              </Checkbox>
            </FormControl>

            <Button variant={'outline'}>
              Submit delegate profile
            </Button>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export const documentProps = {
  title: 'Snip / Create',
} satisfies DocumentProps;
