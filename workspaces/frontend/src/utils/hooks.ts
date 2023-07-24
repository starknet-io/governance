import { useBalance, useEnsName } from "wagmi";

export const useBalanceData = (address: `0x${string}` | undefined) => {
  const { data: balance, isFetched } = useBalance({
    address,
    chainId: parseInt(import.meta.env.VITE_APP_DELEGATION_CHAIN_ID),
    token: import.meta.env.VITE_APP_DELEGATION_TOKEN,
    enabled: address != null
  });

  const { data: ensName } = useEnsName({
    address,
    enabled: address != null
  });

  return {
    address,
    balance: balance?.formatted ?? "0",
    ethAddress: ensName ?? address,
    symbol: balance?.symbol ?? import.meta.env.VITE_APP_DELEGATION_SYMBOL,
    isFetched
  };
};
