import {
  DynamicContextProvider,
  DynamicWidget,
  UserProfile,
  Wallet,
  WalletConnector,
  DynamicNav,
  useDynamicContext,
} from "@dynamic-labs/sdk-react";
import {
  Logo,
  NavGroup,
  NavItem,
  Layout,
  Header,
  Box,
  SnipsIcon,
  ProposalsIcon,
  DelegatesIcon,
  SecurityIcon,
  LearnIcon,
  SupportIcon,
  FeedbackIcon,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Button,
  GiHamburgerMenu,
  ArrowLeftIcon,
  SettingsIcon,
  UserProfileMenu,
} from "@yukilabs/governance-components";
import { Suspense, useEffect, useRef, useState } from "react";
import { PageContext } from "./types";
import { trpc } from "src/utils/trpc";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import React from "react";
import { useOutsideClick } from "@chakra-ui/react";
import { gql } from "src/gql";
import { useQuery } from "@apollo/client";
import { useBalanceData } from "src/utils/hooks";
import { useDelegateRegistryDelegation } from "src/wagmi/DelegateRegistry";

// need to move this override to a better place
const cssOverrides = `

  .button--padding-large {
    padding: 0.74rem 1rem;
    border-radius: 4px;
  }

  .evm-network-control__container span {
    display: none
  }
  .account-control__container img {
    display: none
  }
`;

interface Props {
  readonly pageContext: PageContext;
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

const AuthorizationView = () => <DynamicWidget />;

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

  const userBalance = useBalanceData(address as `0x${string}`);

  const delegation = useDelegateRegistryDelegation({
    address: import.meta.env.VITE_APP_DELEGATION_REGISTRY,
    args: [
      address! as `0x${string}`,
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    ],
    watch: true,
    chainId: parseInt(import.meta.env.VITE_APP_DELEGATION_CHAIN_ID),
    enabled: address != null,
  });

  const delegatedTo = trpc.delegates.getDelegateByAddress.useQuery({
    address: delegation?.data as string,
  });

  const editUserProfile = trpc.users.editUserProfile.useMutation();

  useEffect(() => {
    function handleClick(event: any) {
      const clickedElement = event.target;
      const originalClickedElement = event.originalTarget || event.target;

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

  const handleSave = (username: string, starknetWalletAddress: string) => {
    editUserProfile.mutateAsync(
      {
        id: userData.id,
        username,
        starknetWalletAddress,
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
          <UserProfileMenu
            delegatedTo={delegatedTo.data}
            onDisconnect={handleDisconnect}
            user={userData}
            onSave={handleSave}
            vp={vp?.vp?.vp ?? 0}
            userBalance={userBalance}
          />
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

const DynamicContextProviderPage = (props: Props) => {
  const { pageContext, children } = props;
  const [authArgs, setAuthArgs] = useState<AuthSuccessParams | null>(null);
  const authMutation = trpc.auth.authUser.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();

  const authUser = async (args: AuthSuccessParams) => {
    authMutation.mutate({
      authToken: args.authToken,
      ensName: args.user.ens?.name,
      ensAvatar: args.user.ens?.avatar,
    });
  };

  useEffect(() => {
    if (authArgs) {
      authUser(authArgs);
    }
  }, [authArgs]);

  return (
    <DynamicContextProvider
      settings={{
        environmentId: import.meta.env.VITE_APP_DYNAMIC_ID,
        eventsCallbacks: {
          onAuthSuccess: (params: AuthSuccessParams) => setAuthArgs(params),
          onLogout: () => logoutMutation.mutate(),
        },
        cssOverrides,
      }}
    >
      <DynamicWagmiConnector>
        <Suspense fallback={<p>Loading...</p>}>
          {(pageContext.hasLayout ?? true) === true ? (
            <PageLayout pageContext={pageContext}>{children}</PageLayout>
          ) : (
            children
          )}
        </Suspense>
      </DynamicWagmiConnector>
    </DynamicContextProvider>
  );
};

interface BackButtonProps {
  urlStart: string;
  href: string;
  buttonText: string;
  pageContext: { urlOriginal: string };
}

const BackButton = ({
  urlStart,
  href,
  buttonText,
  pageContext,
}: BackButtonProps) => {
  if (
    pageContext.urlOriginal.includes("/councils/") &&
    pageContext.urlOriginal.startsWith(urlStart)
  ) {
    const goBack = () => {
      window.history.back();
    };
    return (
      <Box>
        <Button
          leftIcon={<ArrowLeftIcon boxSize="20px" />}
          size={"sm"}
          variant="ghost"
          onClick={goBack}
        >
          {buttonText}
        </Button>
      </Box>
    );
  }
  if (pageContext.urlOriginal.startsWith(urlStart)) {
    return (
      <Box>
        <Button
          leftIcon={<ArrowLeftIcon boxSize="20px" />}
          size={"sm"}
          as="a"
          href={href}
          variant="ghost"
        >
          {buttonText}
        </Button>
      </Box>
    );
  }
  return null;
};

function PageLayout(props: Props) {
  const { children, pageContext } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const councilResp = trpc.councils.getAll.useQuery();

  const { user } = useDynamicContext();
  const isAuthorized = !!user;
  const dynamicCustomWidget = isAuthorized ? (
    <AuthorizedUserView />
  ) : (
    <AuthorizationView />
  );

  return (
    <>
      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader py="16px">Menu</DrawerHeader>

          <DrawerBody px="12px" py="16px" pt="0">
            <NavGroup>
              <NavItem
                active={pageContext.urlOriginal}
                icon={<FeedbackIcon />}
                label="Feedback"
              />
              <NavItem
                active={pageContext.urlOriginal}
                icon={<SupportIcon />}
                label="Support"
              />
              <NavItem
                href="/learn"
                active={pageContext.urlOriginal}
                icon={<LearnIcon />}
                label="Learn"
              />
            </NavGroup>
            <NavGroup>
              {councilResp.data?.map((council) => (
                <NavItem
                  key={council.id}
                  active={pageContext.urlOriginal}
                  icon={<SecurityIcon />}
                  label={council.name ?? "Unknown"}
                  href={
                    council.slug ? `/councils/${council.slug}` : "/councils"
                  }
                />
              ))}
            </NavGroup>
            <NavGroup>
              <NavItem
                icon={<DelegatesIcon />}
                active={pageContext.urlOriginal}
                href="/delegates"
                label="Delegates"
              />

              <NavItem
                href="/voting-proposals"
                //todo: fix how active state for menu works
                active={pageContext.urlOriginal}
                icon={<ProposalsIcon />}
                label="Voting proposals"
              />
              <NavItem
                active={pageContext.urlOriginal}
                href="/snips"
                icon={<SnipsIcon />}
                label="Core SNIPs"
              />
            </NavGroup>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Layout.Root>
        <Box
          display={{ base: "block", md: "none" }}
          zIndex="2"
          position="fixed"
          right="24px"
          bottom="16px"
        >
          <Button
            leftIcon={<GiHamburgerMenu />}
            variant="solid"
            colorScheme="teal"
            onClick={onOpen}
          >
            Menu
          </Button>
        </Box>
        <Layout.LeftAside>
          <Logo />
          <Box mt="-20px">
            <NavGroup>
              <NavItem
                active={pageContext.urlOriginal}
                href="/snips"
                icon={<SnipsIcon />}
                label="Core SNIPs"
              />
              <NavItem
                href="/voting-proposals"
                //todo: fix how active state for menu works
                active={pageContext.urlOriginal}
                icon={<ProposalsIcon />}
                label="Voting proposals"
              />

              <NavItem
                icon={<DelegatesIcon />}
                active={pageContext.urlOriginal}
                href="/delegates"
                label="Delegates"
              />
            </NavGroup>
          </Box>
          <NavGroup
            label="Councils"
            action={
              <Button as="a" href="/councils/create" variant="icon" size="md">
                +
              </Button>
            }
          >
            {councilResp.data?.map((council) => (
              <NavItem
                key={council.id}
                active={pageContext.urlOriginal}
                icon={<SecurityIcon />}
                label={council.name ?? "Unknown"}
                href={council.slug ? `/councils/${council.slug}` : "/councils"}
              />
            ))}
          </NavGroup>
          <NavGroup alignEnd>
            <NavItem
              href="/learn"
              active={pageContext.urlOriginal}
              icon={<LearnIcon />}
              label="Learn"
            />
            <NavItem
              href="/settings"
              active={pageContext.urlOriginal}
              icon={<SettingsIcon />}
              label="Settings"
            />
            <NavItem
              active={pageContext.urlOriginal}
              icon={<SupportIcon />}
              label="Support"
            />
            <NavItem
              active={pageContext.urlOriginal}
              icon={<FeedbackIcon />}
              label="Feedback"
            />
          </NavGroup>
        </Layout.LeftAside>
        <Layout.Main>
          <Header>
            <BackButton
              urlStart="/delegates/profile/"
              href="/delegates"
              buttonText="Delegates"
              pageContext={pageContext}
            />
            <BackButton
              urlStart="/voting-proposals/"
              href="/voting-proposals"
              buttonText="Voting proposals"
              pageContext={pageContext}
            />
            <BackButton
              urlStart="/snips/"
              href="/snips"
              buttonText="Core snips"
              pageContext={pageContext}
            />
            <BackButton
              urlStart="/councils/"
              href="/councils"
              buttonText="Back to councils"
              pageContext={pageContext}
            />

            <Box display="flex" marginLeft="auto">
              {dynamicCustomWidget}
            </Box>
          </Header>
          <Layout.Content>{children}</Layout.Content>
        </Layout.Main>
      </Layout.Root>
    </>
  );
}

export default DynamicContextProviderPage;
