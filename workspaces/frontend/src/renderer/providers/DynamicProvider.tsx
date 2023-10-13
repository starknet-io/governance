import {
  DynamicContextProvider,
  UserProfile,
  Wallet,
  WalletConnector,
} from "@dynamic-labs/sdk-react";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { useCallback, useEffect, useRef, useState } from "react";
import { trpc } from "src/utils/trpc";
import { cssOverrides } from "src/components/style/overrides";


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
  const authMutation = trpc.auth.authUser.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();
  const hasCalledAuthenticateUser = useRef(false);
  const [modalOpen, setModalOpen] = useState(false);

  const editUserProfile = trpc.users.editUserProfileByAddress.useMutation();
  const utils = trpc.useContext();

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

  const handleDynamicLogout = () => {
    logoutMutation.mutateAsync(undefined, {
      onSuccess: () => {
        utils.auth.currentUser.invalidate();
        setAuthUser(null);
      },
    });
  };
  return (
    <DynamicContextProvider
      settings={{
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
  );
};
