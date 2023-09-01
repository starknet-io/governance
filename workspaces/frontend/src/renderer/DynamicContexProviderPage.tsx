/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  DynamicContextProvider,
  DynamicWidget,
  UserProfile,
  Wallet,
  WalletConnector,
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
  Spinner,
  InfoModal,
  Text,
  FormModal,
  FormControl,
  FormLabel,
  Input,
} from "@yukilabs/governance-components";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { PageContext } from "./types";
import { trpc } from "src/utils/trpc";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import React, { useCallback } from "react";
import { HelpMessageProvider, useHelpMessage } from "src/hooks/HelpMessage";
import { GlobalSearch } from "@yukilabs/governance-components/src";
import { useGlobalSearch } from "src/hooks/GlobalSearch";

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

export function DynamicContextProviderPage(props: Props) {
  const { pageContext, children } = props;
  const [authUser, setAuthUser] = useState<AuthSuccessParams | null>(null);
  const authMutation = trpc.auth.authUser.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();
  const hasCalledAuthenticateUser = useRef(false); // To guard against continuous calls
  const [modalOpen, setModalOpen] = useState(false);
  const editUserProfile = trpc.users.editUserProfileByAddress.useMutation();

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

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const [username, setUsername] = useState("");
  const [starknetAddress, setStarknetAddress] = useState("");

  const isFormValid = !!(username && starknetAddress);

  const onSubmit = () => {
    editUserProfile.mutateAsync(
      {
        address: authUser?.user?.verifiedCredentials[0]?.address ?? "",
        username,
        starknetAddress,
      },
      {
        onSuccess: () => {
          setModalOpen(false);
        },
      },
    );
  };

  return (
    <HelpMessageProvider>
      <FormModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        title="Add User Info"
        onSubmit={onSubmit}
        isValid={isFormValid}
        cancelButtonText="Skip"
      >
        <FormControl id="member-name" paddingBottom={2}>
          <FormLabel lineHeight="22px" fontSize="14px" fontWeight="600">
            Username
          </FormLabel>
          <Input
            placeholder="Username"
            name="name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl id="address" paddingBottom={2}>
          <FormLabel lineHeight="22px" fontSize="14px" fontWeight="600">
            Starknet address
          </FormLabel>
          <Input
            placeholder="0x..."
            name="address"
            value={starknetAddress}
            onChange={(e) => setStarknetAddress(e.target.value)}
          />
        </FormControl>
      </FormModal>
      <DynamicContextProvider
        settings={{
          environmentId: import.meta.env.VITE_APP_DYNAMIC_ID,
          eventsCallbacks: {
            onAuthSuccess: (params: AuthSuccessParams) => {
              // Guard against setting the state if authUser data hasn't changed
              if (JSON.stringify(authUser) !== JSON.stringify(params)) {
                setAuthUser(params);
              }
            },
            onLogout: () => logoutMutation.mutate(),
          },
          cssOverrides,
        }}
      >
        <DynamicWagmiConnector>
          <Suspense
            fallback={
              <Box
                display="flex"
                height="100vh"
                justifyContent="center"
                alignItems="center"
              >
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="#fff"
                  color="#ccc"
                  size="xl"
                />
              </Box>
            }
          >
            {(pageContext.hasLayout ?? true) === true ? (
              <PageLayout pageContext={pageContext}>{children}</PageLayout>
            ) : (
              children
            )}
          </Suspense>
        </DynamicWagmiConnector>
      </DynamicContextProvider>
    </HelpMessageProvider>
  );
}

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

const LazyDataComponent = lazy(() => import("./AuthorizedUserView"));

const DynamicCustomWidget = () => {
  const { user } = useDynamicContext();
  const isAuthorized = !!user;

  return isAuthorized ? (
    <Suspense fallback={<Spinner size="sm" />}>
      <LazyDataComponent />
    </Suspense>
  ) : (
    <DynamicWidget />
  );
};

function PageLayout(props: Props) {
  const [helpMessage, setHelpMessage] = useHelpMessage();
  const { globalSearchResults, handleGlobalSearchItems } = useGlobalSearch();
  const { children, pageContext } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const councilResp = trpc.councils.getAll.useQuery();
  const [renderDone, setRenderDone] = useState(false);

  useEffect(() => {
    setRenderDone(true);
  }, []);

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    if (helpMessage === "connectWalletMessage") {
      timer = setTimeout(() => {
        setHelpMessage(null);
      }, 3000);
      return () => {
        clearTimeout(timer);
      };
    }
    // An empty cleanup function when no timeout was set.
    return () => {
      /* no cleanup to run */
    };
  }, [helpMessage, setHelpMessage]);

  console.log({ globalSearchResults });

  return (
    <>
      <InfoModal
        title="connect your wallet"
        isOpen={helpMessage === "connectWalletMessage"}
        onClose={() => setHelpMessage(null)}
      >
        <Text>To action you need to connect your wallet</Text>
        <Button variant="solid" onClick={() => console.log("connect wallet")}>
          Connect your wallet
        </Button>
      </InfoModal>

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
              {renderDone ? <DynamicCustomWidget /> : <Spinner size="sm" />}
            </Box>
            <GlobalSearch
              searchResults={globalSearchResults}
              onSearchItems={handleGlobalSearchItems}
            />
          </Header>
          <Layout.Content>{children}</Layout.Content>
        </Layout.Main>
      </Layout.Root>
    </>
  );
}
