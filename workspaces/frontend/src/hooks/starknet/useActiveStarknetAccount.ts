import { useWallets } from "../useWallets";

export const useActiveStarknetAccount = () => {
  const { starknetWallet } = useWallets();

  if (!starknetWallet?.address) {
    return null;
  } else if (typeof window !== "undefined") {
    const isBraavos = starknetWallet?.connector?.name === "Braavos";
    if (isBraavos) {
      return window?.starknet_braavos?.account?.address;
    } else return window?.starknet?.account?.address;
  }
  return null;
};
