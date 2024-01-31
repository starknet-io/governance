import { useState, useEffect } from "react";


export const useStarknetAccount = () => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const connectWallet = async () => {
      try {
        if (window.starknet && window.starknet.isStarknet) {
          // Connect to the wallet
          await window.starknet.enable();

          // The wallet extension itself acts as the signer
          const wallet = window.starknet.account;

          // Set the account with the provider and the wallet
          setAccount(wallet);
        } else {
          setError("StarkNet wallet extension not found");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    connectWallet();
  }, []);

  return { account, error };
};
