import { DynamicNav, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useRef, useState } from "react";
import { trpc } from "src/utils/trpc";
import { useOutsideClick } from "@chakra-ui/react";
import { UserProfileMenu } from "@yukilabs/governance-components";
import { useBalanceData } from "src/utils/hooks";
import { useDelegateRegistryDelegation } from "src/wagmi/DelegateRegistry";
import { gql } from "src/gql";
import { useQuery } from "@apollo/client";
import { stringToHex } from "viem";
import { usePageContext } from "./PageContextProvider";
import { navigate } from "vite-plugin-ssr/client/router";
import { useFileUpload } from "src/hooks/useFileUpload";
import useIsMobile from "@yukilabs/governance-frontend/src/hooks/useIsMobile";

const AuthorizedUserView = () => {
  const navRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userExistsError, setUserExistsError] = useState(false);
  const utils = trpc.useContext();

  const [isUserModalOpen, setIsModalOpen] = useState(false);
  const { handleLogOut } = useDynamicContext();
  const { handleUpload } = useFileUpload();
  const { user } = usePageContext();
  const { isMobile } = useIsMobile();
  const { data: vp } = useQuery(
    gql(`query Vp($voter: String!, $space: String!, $proposal: String) {
      vp(voter: $voter, space: $space, proposal: $proposal) {
        vp
        vp_by_strategy
        vp_state
      }
    }`),
    {
      variables: {
        space: import.meta.env.VITE_APP_SNAPSHOT_SPACE,
        voter: user?.address as string,
      },
      skip: !user?.address, // Skip the query if the user address is not available
    },
  );

  const userBalance = useBalanceData(user?.address as `0x${string}`);

  const { data: delegationData, isLoading } = useDelegateRegistryDelegation({
    address: import.meta.env.VITE_APP_DELEGATION_REGISTRY,
    args: [
      user?.address as `0x${string}`,
      stringToHex(import.meta.env.VITE_APP_SNAPSHOT_SPACE, { size: 32 }),
    ],
    watch: true,
    chainId: parseInt(import.meta.env.VITE_APP_DELEGATION_CHAIN_ID),
    enabled: user?.address != null,
  });

  const hasDelegationData =
    !isLoading && delegationData && delegationData.length;

  const delegatedTo = trpc.delegates.getDelegateByAddress.useQuery(
    {
      address: delegationData ? delegationData.toLowerCase() : "",
    },
    {
      enabled: !!hasDelegationData,
    },
  );

  const editUserProfile = trpc.users.editUserProfile.useMutation();

  const isValidAddress = (addr: string) =>
    addr && addr !== "0x0000000000000000000000000000000000000000";

  const address = user?.address?.toLowerCase() || "";

  const delegate = trpc.delegates.getDelegateByAddress.useQuery({ address });

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
          delegatedTo={delegatedTo?.data ? delegatedTo?.data : delegationData}
          onDisconnect={handleDisconnect}
          user={user}
          onSave={handleSave}
          vp={vp?.vp?.vp ?? 0}
          userBalance={userBalance}
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
