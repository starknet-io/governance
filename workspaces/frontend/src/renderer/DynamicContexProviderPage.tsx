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
  ArrowLeftIcon,
  SettingsIcon,
  Spinner,
  InfoModal,
  Text,
  FormModal,
  FormControl,
  FormLabel,
  Input,
  SupportModal,
  HomeIcon,
  IconButton,
  HamburgerIcon,
  Link,
  PlusIcon,
} from "@yukilabs/governance-components";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { PageContext, ROLES } from "./types";
import { trpc } from "src/utils/trpc";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import React, { useCallback } from "react";
import { HelpMessageProvider, useHelpMessage } from "src/hooks/HelpMessage";
import { hasPermission } from "src/utils/helpers";
import { usePageContext } from "./PageContextProvider";

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

  const handleDynamicLogout = () => {
    logoutMutation.mutateAsync(undefined, {
      onSuccess: () => {
        utils.auth.currentUser.invalidate();
        setAuthUser(null);
      },
    });
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
            onLogout: () => handleDynamicLogout(),
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
  const { children, pageContext } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const councilResp = trpc.councils.getAll.useQuery();
  const [renderDone, setRenderDone] = useState(false);
  const { user } = usePageContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setRenderDone(true);
  }, []);

  console.log(JSON.stringify(pageContext.urlOriginal, null, 2));
  console.log(JSON.stringify(pageContext.urlPathname, null, 2));

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

  return (
    <>
      <SupportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <InfoModal
        title="connect your wallet"
        isOpen={helpMessage === "connectWalletMessage"}
        onClose={() => setHelpMessage(null)}
      >
        <Text>To action you need to connect your wallet</Text>
        <Button variant="primary" onClick={() => console.log("connect wallet")}>
          Connect your wallet
        </Button>
      </InfoModal>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader py="16px">Menu</DrawerHeader>

          <DrawerBody px="12px" py="16px" pt="0">
            <NavigationMenu
              pageContext={pageContext}
              userRole={user?.role}
              councilData={councilResp.data}
              openSupportModal={() => setIsModalOpen(!isModalOpen)}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Layout.Root>
        <Layout.LeftAside>
          <Logo href="/" />
          <NavigationMenu
            pageContext={pageContext}
            userRole={user?.role}
            councilData={councilResp.data}
            openSupportModal={() => setIsModalOpen(!isModalOpen)}
          />
        </Layout.LeftAside>
        <Layout.Main>
          <Header>
            <Box display={{ base: "block", lg: "none" }}>
              <IconButton
                aria-label="Open menu"
                size="condensed"
                icon={<HamburgerIcon />}
                onClick={onOpen}
                variant="ghost"
              />
            </Box>
            <Box display={{ base: "none", lg: "block" }}>
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
            </Box>
            <Box
              display={{ base: "flex", lg: "none" }}
              flex="1"
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Logo href="/" />
            </Box>
            <Box display={{ base: "none", lg: "flex" }} marginLeft="auto">
              {renderDone ? <DynamicCustomWidget /> : <Spinner size="sm" />}
            </Box>
          </Header>
          <Layout.Content>{children}</Layout.Content>
        </Layout.Main>
      </Layout.Root>
    </>
  );
}

interface NavigationMenuProps {
  pageContext: any;
  userRole: string | undefined;
  councilData: any[] | undefined;
  openSupportModal: () => void;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({
  pageContext,
  userRole,
  councilData,
  openSupportModal,
}) => {
  return (
    <>
      <Box mt="-20px">
        <NavGroup>
          {[
            {
              href: "/",
              label: "Home",
              icon: <HomeIcon />,
            },
            {
              href: "/voting-proposals",
              label: "Voting proposals",
              icon: <ProposalsIcon />,
            },
            {
              href: "/delegates",
              label: "Delegates",
              icon: <DelegatesIcon />,
            },
          ].map((item) => (
            <NavItem
              active={item.href === pageContext.urlOriginal}
              icon={item.icon}
              label={item.label}
              key={item.href}
              href={item.href}
            />
          ))}
        </NavGroup>
      </Box>
      <NavGroup label="Councils">
        {councilData?.map((council) => (
          <NavItem
            key={council.id}
            icon={<SecurityIcon />}
            label={council.name ?? "Unknown"}
            href={council.slug ? `/councils/${council.slug}` : "/councils"}
            active={council.slug === pageContext.urlOriginal}
          />
        ))}
        {hasPermission(userRole, [ROLES.ADMIN, ROLES.MODERATOR]) ? (
          <Link href="/councils/create" style={{ border: "none" }}>
            <IconButton
              aria-label="create"
              variant="ghost"
              size="condensed"
              icon={<PlusIcon />}
            />
          </Link>
        ) : (
          <></>
        )}
      </NavGroup>
      <NavGroup alignEnd>
        {[
          {
            href: "/learn",
            label: "Learn",
            icon: <LearnIcon />,
          },
        ].map((item) => (
          <NavItem
            active={item.href === pageContext.urlOriginal}
            icon={item.icon}
            label={item.label}
            key={item.href}
            href={item.href}
          />
        ))}

        {hasPermission(userRole, [ROLES.ADMIN, ROLES.MODERATOR]) ? (
          <NavItem href="/settings" icon={<SettingsIcon />} label="Settings" />
        ) : null}
        <NavItem
          icon={<SupportIcon />}
          label="Support"
          onClick={openSupportModal}
        />

        <NavItem
          href="https://www.starknet.io"
          icon={<FeedbackIcon />}
          label="Feedback"
          variant="feedback"
        />
      </NavGroup>
    </>
  );
};
