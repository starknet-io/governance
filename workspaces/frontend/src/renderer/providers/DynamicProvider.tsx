import {
  UserProfile,
  Wallet,
  WalletConnector,
} from "@dynamic-labs/sdk-react-core";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { StarknetWalletConnectors } from "@dynamic-labs/starknet";
import { ZeroDevSmartWalletConnectors } from "@dynamic-labs/ethereum-aa";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [userExistsError, setUserExistsError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
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
        setModalOpen(true);
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

  useEffect(() => {
    if (authUser && !hasCalledAuthenticateUser.current) {
      authenticateUser(authUser);
      hasCalledAuthenticateUser.current = true; // Mark as called
    } else if (!authUser) {
      hasCalledAuthenticateUser.current = false; // Reset for next time
    }
  }, [authUser, authenticateUser]);

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
          walletConnectors: [
            EthereumWalletConnectors,
            ZeroDevSmartWalletConnectors,
            StarknetWalletConnectors,
          ],
          environmentId: import.meta.env.VITE_APP_DYNAMIC_ID,
          eventsCallbacks: {
            onAuthSuccess: (params: AuthSuccessParams) => {
              setAuthUser(params);
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
