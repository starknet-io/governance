import { Button } from '@yukilabs/governance-components';
import { DocumentProps } from 'src/renderer/types';

export function Page() {
  return (
    <div>
      Page found!
      <Button variant="outline" onClick={() => {}}>
        Click me
      </Button>
    </div>
  );
}

export const documentProps = {
  title: 'Page Found!',
} satisfies DocumentProps;
