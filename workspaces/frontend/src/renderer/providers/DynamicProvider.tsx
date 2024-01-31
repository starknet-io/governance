import {
  FilterWallets,
  RemoveWallets,
  useDynamicContext,
  UserProfile,
  Wallet,
  WalletConnector,
} from "@dynamic-labs/sdk-react-core";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { StarknetWalletConnectors } from "@dynamic-labs/starknet";
import { ZeroDevSmartWalletConnectors } from "@dynamic-labs/ethereum-aa";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { navigate } from "vite-plugin-ssr/client/router";
import { trpc } from "src/utils/trpc";
import { cssOverrides } from "src/components/style/overrides";
import { ProfileInfoModal } from "@yukilabs/governance-components";
import { useFileUpload } from "src/hooks/useFileUpload";
import { usePageContext } from "../PageContextProvider";
interface Props {
  // readonly pageContext: PageContext;
  readonly children: React.ReactNode;
}

interface AuthSuccessParams {
  authToken: string;
  handleLogOut: () => Promise<void>;
  isAuthenticated: boolean;
  primaryWallet: Wallet | null;
  user: UserProfile;
  walletConnector: WalletConnector | undefined;
}

export const DynamicProvider = (props: Props) => {
  const { children } = props;
  const [authUser, setAuthUser] = useState<AuthSuccessParams | null>(null);
  const [secondaryWallet, setSecondaryWallet] = useState<any>(null);
  const [userExistsError, setUserExistsError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentWallet, setCurrentWallet] = useState<string | null>(null);
  const authMutation = trpc.auth.authUser.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();

  const editUserProfile = trpc.users.editUserProfile.useMutation();
  const hasCalledAuthenticateUser = useRef(false);
  const utils = trpc.useContext();
  const { user } = usePageContext();
  const { handleUpload } = useFileUpload();

  const authenticateUser = useCallback(
    async (params: AuthSuccessParams) => {
      if (params?.user?.newUser) {
        navigate("/profile/settings");
      }
      await authMutation.mutateAsync({
        authToken: params.authToken,
        ensName: params.user.ens?.name,
        ensAvatar: params.user.ens?.avatar,
      });
      utils.auth.currentUser.invalidate();
    },
    [authMutation],
  );

  const handleLinkEvent = async (walletAddress: string) => {
    if (user) {
      await editUserProfile.mutateAsync({
        id: user.id,
        starknetAddress: walletAddress,
      });
    }
  };

  useEffect(() => {
    // Function to check and load the current wallet from localStorage
    const loadCurrentWalletFromLocalStorage = () => {
      const walletInfo = localStorage.getItem("dynamic_authenticated_user"); // Replace with your actual key

      if (walletInfo) {
        const wallet = JSON.parse(walletInfo);

        if (wallet.chain === "eip155") {
          setCurrentWallet("ethereum");
        } else if (wallet.chain === "starknet") {
          setCurrentWallet("starknet");
        } else {
          setCurrentWallet(null);
        }
      } else {
        setCurrentWallet(null);
      }
    };

    // Call the function to load the current wallet from localStorage
    loadCurrentWalletFromLocalStorage();
  }, []);

  useEffect(() => {
    if (authUser && !hasCalledAuthenticateUser.current) {
      authenticateUser(authUser);
      hasCalledAuthenticateUser.current = true; // Mark as called
    } else if (!authUser) {
      hasCalledAuthenticateUser.current = false; // Reset for next time
    }
  }, [authUser, authenticateUser]);

  useEffect(() => {
    if (secondaryWallet && secondaryWallet.address && user) {
      if (secondaryWallet.chain === "starknet") {
        handleLinkEvent(secondaryWallet.address);
      }
    }
  }, [secondaryWallet]);

  async function handleSave(data: {
    username: string;
    starknetAddress: string;
    profileImage: string | null;
  }): Promise<any> {
    if (!user) {
      return false;
    }
    try {
      const res = await editUserProfile.mutateAsync(
        {
          id: user.id,
          username: data.username !== user?.username ? data.username : null,
          starknetAddress: data.starknetAddress,
          profileImage: data.profileImage,
        },
        {
          onSuccess: () => {
            utils.auth.currentUser.invalidate();
            setModalOpen(false);
            return true;
          },
          onError: (error) => {
            if (error.message === "Username already exists") {
              setUserExistsError(true);
            }
            return false;
          },
        },
      );
      return res;
    } catch (error) {
      return false;
    }
  }
  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleDynamicLogout = () => {
    logoutMutation.mutateAsync(undefined, {
      onSuccess: () => {
        utils.auth.currentUser.invalidate();
        setAuthUser(null);
      },
    });
  };

  const starknetWallets = ["argentx", "braavos"];

  const walletToShow = useMemo(() => {
    if (!currentWallet) {
      return RemoveWallets([]);
    } else if (currentWallet === "ethereum") {
      return FilterWallets(starknetWallets);
    } else if (currentWallet === "starknet") {
      return RemoveWallets(starknetWallets);
    } else {
      return RemoveWallets([]);
    }
  }, [currentWallet]);

  //const { walletConnectorOptions } = useDynamicContext();
  //console.log(walletConnectorOptions.map((wallet) => wallet.key));

  return (
    <>
      <ProfileInfoModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        user={user}
        mode="create"
        handleUpload={handleUpload}
        saveData={(data) => handleSave(data)}
        userExistsError={userExistsError}
        setUsernameErrorFalse={() => setUserExistsError(false)}
      />
      <DynamicContextProvider
        settings={{
          ...(currentWallet ? { walletsFilter: walletToShow } : {}),
          walletConnectors: [
            EthereumWalletConnectors,
            ZeroDevSmartWalletConnectors,
            StarknetWalletConnectors,
          ],
          environmentId: import.meta.env.VITE_APP_DYNAMIC_ID,
          eventsCallbacks: {
            onAuthSuccess: (params: AuthSuccessParams) => {
              const primaryWalletChain = params?.primaryWallet?.chain;
              if (primaryWalletChain === "eip155") {
                setCurrentWallet("ethereum");
              } else if (primaryWalletChain === "starknet") {
                setCurrentWallet("starknet");
              } else {
                setCurrentWallet(null);
              }
              setAuthUser(params);
            },
            onLinkSuccess: (params) => {
              const wallet = params?.wallet;
              if (user && wallet) {
                setSecondaryWallet(wallet);
              }
            },
            onDisconnect: () => {
              setCurrentWallet(null)
            },
            onLogout: () => handleDynamicLogout(),
          },
          cssOverrides,
        }}
      >
        <DynamicWagmiConnector>
          {children}
          {/* <LayoutDefault pageContext={pageContext}>{children}</LayoutDefault> */}
        </DynamicWagmiConnector>
      </DynamicContextProvider>
    </>
  );
};
