import { useBalance, useEnsName } from "wagmi";

export const useBalanceData = (
  address: `0x${string}` | undefined,
  delegateBalance = false,
) => {
  const { data: balance, isFetched } = useBalance({
    address,
    ...(!delegateBalance
      ? { chainId: parseInt(import.meta.env.VITE_APP_DELEGATION_CHAIN_ID) }
      : { chainId: 1 }),
    ...(!delegateBalance
      ? { token: import.meta.env.VITE_APP_DELEGATION_TOKEN }
      : {}),
    enabled: address != null,
  });

  const { data: ensName } = useEnsName({
    address,
    enabled: address != null,
  });

  return {
    address,
    balance: balance?.formatted ?? "0",
    balanceRaw: parseFloat(balance?.formatted || "0"),
    ethAddress: ensName ?? address,
    symbol: balance?.symbol ?? import.meta.env.VITE_APP_DELEGATION_SYMBOL,
    isFetched,
  };
};
