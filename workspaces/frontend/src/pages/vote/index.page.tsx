import { DocumentProps } from 'src/renderer/types';

import { Box, AppBar, Button } from '@yukilabs/governance-components';

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
    </>
  );
}

export const documentProps = {
  title: 'Vote',
} satisfies DocumentProps;
