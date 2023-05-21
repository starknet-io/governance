import { DocumentProps } from 'src/renderer/types';

import {
  Box,
  AppBar,
  Button,
  Text,
  Heading,
} from '@yukilabs/governance-components';

export function Page() {
  return (
    <>
      <AppBar>
        <Box>
          <Box>
            <Button as="a" href="/" variant="outline">
              Back
            </Button>
          </Box>
        </Box>
        <Box display="flex" marginLeft="auto">
          <Button variant="outline">Edit</Button>
        </Box>
      </AppBar>
      <Box>
        {/* //markdown comp */}
        <Heading variant="h3">
          Support for scoped storage variables
        </Heading>
        <Text variant="body">
          Namespaces are a very powerful (although undocumented) way
          to write Cairo modules. It allows scoping function
          definitions under an identifier 17, helping prevent
          collisions when importing functions from multiple modules.
        </Text>
        <Text variant="body">
          Nevertheless, the current implementation does not allow to
          scope storage variables (or functions representing them)
          within namespaces, opening the door for storage collisions
          in the case of two modules defining the same storage
          variable, like this:
        </Text>
      </Box>
    </>
  );
}

export const documentProps = {
  title: 'Snips',
} satisfies DocumentProps;
