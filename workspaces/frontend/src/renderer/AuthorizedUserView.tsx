import {
  DynamicNav,
  useDynamicContext,
  useUserWallets,
} from "@dynamic-labs/sdk-react-core";
import { useEffect, useRef, useState } from "react";
import { trpc } from "src/utils/trpc";
import { useOutsideClick } from "@chakra-ui/react";
import { UserProfileMenu } from "../components/UserProfile";
import { useBalanceData } from "src/utils/hooks";
import { useL1StarknetDelegationDelegates } from "../wagmi/L1StarknetDelegation";
import { usePageContext } from "./PageContextProvider";
import { navigate } from "vite-plugin-ssr/client/router";
import { useFileUpload } from "src/hooks/useFileUpload";
import { useVotingPower } from "../hooks/snapshotX/useVotingPower";
import { WalletChainKey } from "../utils/constants";
import useIsMobile from "@yukilabs/governance-frontend/src/hooks/useIsMobile";
import { findMatchingWallet } from "../utils/helpers";
import { useStarknetBalance } from "../hooks/starknet/useStarknetBalance";
import { useStarknetDelegates } from "../hooks/starknet/useStarknetDelegates";
import { useWallets } from "../hooks/useWallets";

const starkContract = import.meta.env.VITE_APP_STRK_CONTRACT;

const AuthorizedUserView = () => {
  const navRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userExistsError, setUserExistsError] = useState(false);
  const utils = trpc.useContext();
  const { ethWallet, starknetWallet } = useWallets();

  const ethAddress = ethWallet?.address;
  const starknetAddress = starknetWallet?.address;

  const [isUserModalOpen, setIsModalOpen] = useState(false);
  const { handleLogOut } = useDynamicContext();
  const { handleUpload } = useFileUpload();
  const { user } = usePageContext();
  const { isMobile } = useIsMobile();

  const { data: votingPowerEthereum, isLoading: isVotingPowerEthLoading } =
    useVotingPower({
      address: ethAddress,
    });

  const { data: votingPowerStarknet, isLoading: isVotingPowerStarknetLoading } =
    useVotingPower({
      address: starknetAddress,
    });

  const ethBalance = useBalanceData(ethAddress as `0x${string}`);
  const { balance: vSTRKBalance, loading: isvSTRKBalanceLoading } =
    useStarknetBalance({ starknetAddress });
  const { balance: starknetBalance, loading: isStarknetBalanceLoading } =
    useStarknetBalance({ starknetAddress, starkContract });

  const { data: delegationData, isLoading } = useL1StarknetDelegationDelegates({
    address: import.meta.env.VITE_APP_STARKNET_REGISTRY,
    args: [user?.address as `0x${string}`],
    watch: true,
    enabled: user?.address != null,
  });

  const { delegates: delegationDataL2, loading: isLoadingL2Delegation } =
    useStarknetDelegates({
      starknetAddress,
    });

  const hasDelegationData =
    !isLoading && delegationData && delegationData.length;
  const hasDelegationDataL2 = !!(
    !isLoadingL2Delegation &&
    delegationDataL2 &&
    delegationDataL2.length
  );

  const delegatedTo = trpc.delegates.getDelegateByAddress.useQuery(
    {
      address: delegationData ? delegationData.toLowerCase() : "",
    },
    {
      enabled: !!hasDelegationData,
    },
  );

  const delegatedToL2 = trpc.delegates.getDelegateByAddress.useQuery(
    {
      starknetAddress: delegationDataL2 ? delegationDataL2.toLowerCase() : "",
    },
    {
      enabled: !!hasDelegationDataL2,
    },
  );

  const editUserProfile = trpc.users.editUserProfile.useMutation();

  const isValidAddress = (addr: string) =>
    addr && addr !== "0x0000000000000000000000000000000000000000";

  const address = user?.address?.toLowerCase() || "";

  const delegate = trpc.delegates.getDelegateByAddress.useQuery(
    { address },
    {
      enabled: !!(address && address?.length),
    },
  );

  const delegationStatement = delegate.data?.delegationStatement;

  const checkDelegateStatus =
    delegationStatement?.isKarmaDelegate &&
    !delegationStatement?.isGovernanceDelegate;
  // Effect for handling redirection based on address and specific path
  useEffect(() => {
    const currentPath = window.location.pathname;

    const isOnSpecificPath =
      currentPath.startsWith("/delegates/profile/onboarding/") ||
      currentPath.startsWith("/delegates/profile/edit/");

    if (isOnSpecificPath && !user) {
      navigate(`/`);
    }
  }, [user]);

  // Effect for handling navigation based on delegate status and address validity
  useEffect(() => {
    if (isValidAddress(address) && checkDelegateStatus) {
      navigate(`/delegates/profile/onboarding/${delegationStatement?.id}`);
    }
  }, [address, delegate.data, checkDelegateStatus]);

  useEffect(() => {
    function handleClick(event: any) {
      const clickedElement = event.target;
      const originalClickedElement =
        event.originalTarget || event.composedPath()[0] || event.target;
      if (
        clickedElement.classList.contains("dynamic-shadow-dom") &&
        ((originalClickedElement.classList.contains(
          "account-control__container",
        ) &&
          originalClickedElement.nodeName === "BUTTON") ||
          (originalClickedElement.classList.contains("typography") &&
            originalClickedElement.nodeName === "P"))
      ) {
        handleAddressClick(event);
      }
    }

    if (navRef.current) {
      navRef.current.addEventListener("click", handleClick);

      return () => {
        navRef.current?.removeEventListener("click", handleClick);
      };
    }
    return () => {
      // intentionally empty cleanup function
    };
  }, []);

  const handleAddressClick = (event: any) => {
    event.preventDefault();
    setIsMenuOpen(true);
  };

  useOutsideClick({
    ref: navRef,
    handler: () => {
      if (!isMobile && isMenuOpen) {
        setIsMenuOpen(false);
      }
    },
  });

  const userProfileMenuRef = useRef<HTMLDivElement>(null);

  const handleDisconnect = () => {
    handleLogOut();
    // setIsMenuOpen(false);
  };

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

  return (
    <>
      <div className="user-menu" ref={navRef}>
        <DynamicNav />
        <UserProfileMenu
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          ref={userProfileMenuRef}
          delegatedToL1={delegatedTo?.data ? delegatedTo?.data : delegationData}
          delegatedToL2={
            delegatedToL2?.data ? delegatedToL2?.data : delegationDataL2
          }
          delegatedToL1Loading={delegatedTo.isLoading}
          delegatedToL2Loading={delegatedToL2.isLoading}
          onDisconnect={handleDisconnect}
          user={user}
          onSave={handleSave}
          ethAddress={ethAddress}
          starknetAddress={starknetAddress}
          votingPowerEth={votingPowerEthereum}
          votingPowerStark={votingPowerStarknet}
          isVotingPowerEthLoading={isVotingPowerEthLoading}
          isVotingPowerStarknetLoading={isVotingPowerStarknetLoading}
          ethBalance={ethBalance}
          vSTRKBalance={vSTRKBalance}
          starknetBalance={starknetBalance}
          isvSTRKBalanceLoading={isvSTRKBalanceLoading}
          isStarknetBalanceLoading={isStarknetBalanceLoading}
          onModalStateChange={(isOpen: boolean) => setIsModalOpen(isOpen)}
          handleUpload={handleUpload}
          userExistsError={userExistsError}
          setUsernameErrorFalse={() => setUserExistsError(false)}
        />
      </div>
    </>
  );
};

export default AuthorizedUserView;
