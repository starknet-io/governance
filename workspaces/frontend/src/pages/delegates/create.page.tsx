import { DocumentProps } from 'src/renderer/types';

import { Box, AppBar, Button } from '@yukilabs/governance-components';

export function Page() {
  return (
    <>
      <AppBar>
        <Box>
          <Box>/</Box>
        </Box>
        <Box display="flex" marginLeft="auto">
          <Button variant="outline">Add Posst</Button>
        </Box>
      </AppBar>
    </>
  );
}

export const documentProps = {
  title: 'Delegates / Create',
} satisfies DocumentProps;
