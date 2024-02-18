import { useWallets } from "../useWallets";

export const useActiveStarknetAccount = () => {
  const { starknetWallet } = useWallets();
  if (!starknetWallet?.address) {
    return null;
  } else if (typeof window !== "undefined") {
    const isBraavos = starknetWallet?.connector?.name === "Braavos";
    if (isBraavos) {
      console.log(starknetWallet?.address, window?.starknet_braavos?.account?.address)
      return window?.starknet_braavos?.account?.address;
    } else return window?.starknet?.account?.address;
  }
  return null;
};
