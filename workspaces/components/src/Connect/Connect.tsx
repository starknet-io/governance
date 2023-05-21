import { Connected } from './Connected';
import { NotConnected } from './NotConnected';

type Props = {
  isConnected: boolean;
  address: string;
};

export const Connect = (props: Props) => {
  if (props.isConnected) {
    return <Connected address={props.address} />;
  }
  return <NotConnected />;
};
