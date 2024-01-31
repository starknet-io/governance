import {findMatchingWallet} from "../utils/helpers";
import {useUserWallets} from "@dynamic-labs/sdk-react-core";


export const useWallets = () => {
  const userWallets = useUserWallets();

  const starknetWallet = findMatchingWallet(userWallets, 'STARKNET');
  const ethWallet = findMatchingWallet(userWallets, 'EVM');

  return { starknetWallet, ethWallet };
};

