import { DynamicNav, useDynamicContext } from "@dynamic-labs/sdk-react";
import { useEffect, useRef, useState } from "react";
import { trpc } from "src/utils/trpc";
import { useOutsideClick } from "@chakra-ui/react";
import { UserProfileMenu } from "@starknet-foundation/governance-ui";
import { useBalanceData } from "src/utils/hooks";
import { useDelegateRegistryDelegation } from "src/wagmi/DelegateRegistry";
import { gql } from "src/gql";
import { useQuery } from "@apollo/client";

const AuthorizedUserView = () => {
  const navRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const { handleLogOut } = useDynamicContext();
  const { user } = useDynamicContext();
  const address = user?.verifiedCredentials[0]?.address;
  trpc.users.getUser.useQuery(
    { address: address ?? "" },
    {
      onSuccess: (data) => {
        setUserData(data);
      },
    },
  );

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
        voter: address as string,
      },
    },
  );

  const userBalance = useBalanceData(
    user?.verifiedCredentials[0]?.address as `0x${string}`,
  );

  const { data: delegationData } = useDelegateRegistryDelegation({
    address: import.meta.env.VITE_APP_DELEGATION_REGISTRY,
    args: [
      address! as `0x${string}`,
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    ],
    watch: false,
    chainId: parseInt(import.meta.env.VITE_APP_DELEGATION_CHAIN_ID),
    enabled: address != null,
    suspense: true,
    onError: (error) => {
      console.log("error", error);
    },
  });

  const delegatedTo = trpc.delegates.getDelegateByAddress.useQuery({
    address: delegationData ? delegationData : "",
  });

  const editUserProfile = trpc.users.editUserProfile.useMutation();

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
    setIsMenuOpen(!isMenuOpen);
  };

  useOutsideClick({
    ref: navRef,
    handler: () => {
      setIsMenuOpen(false);
    },
  });

  const handleDisconnect = () => {
    handleLogOut();
    setIsMenuOpen(false);
  };

  const handleSave = (username: string, starknetAddress: string) => {
    editUserProfile.mutateAsync(
      {
        id: userData.id,
        username,
        starknetAddress,
      },
      {
        onSuccess: (data) => {
          setUserData(data);
        },
      },
    );
    setIsMenuOpen(false);
  };

  return (
    <>
      <div ref={navRef}>
        <DynamicNav />
        {isMenuOpen ? (
          <>
            <UserProfileMenu
              delegatedTo={delegatedTo?.data ? delegatedTo?.data : null}
              onDisconnect={handleDisconnect}
              user={userData}
              onSave={handleSave}
              vp={vp?.vp?.vp ?? 0}
              userBalance={userBalance}
            />
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default AuthorizedUserView;
