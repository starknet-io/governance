/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  DynamicContextProvider,
  DynamicWidget,
  UserProfile,
  Wallet,
  WalletConnector,
  useDynamicContext,
} from "@dynamic-labs/sdk-react";
import { Button as ChakraButton } from "@chakra-ui/react";
import {
  Logo,
  NavGroup,
  NavItem,
  Layout,
  Header,
  ProposalsIcon,
  DelegatesIcon,
  SecurityIcon,
  LearnIcon,
  SupportIcon,
  FeedbackIcon,
  Drawer,
  DrawerOverlay,
  DrawerContent,
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
  ShareDialog,
  HomeIcon,
  IconButton,
  HamburgerIcon,
  Link,
  PlusIcon,
  BuildersIcon,
} from "@yukilabs/governance-components";
import { Box, Show } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { IUser, PageContext, ROLES } from "./types";
import { trpc } from "src/utils/trpc";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import React, { useCallback } from "react";
import { HelpMessageProvider, useHelpMessage } from "src/hooks/HelpMessage";
import { hasPermission } from "src/utils/helpers";
import { usePageContext } from "./PageContextProvider";
import AuthorizedUserView from "./AuthorizedUserView";
import TallyScript from "src/components/TallyScript";

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
 .dynamic-widget-inline-controls  {
  background:#FBFBFB;
  border:1px solid rgba(35, 25, 45, 0.10);
  box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.05);
  font-family: 'Inter Variable', sans-serif;
  border-radius: 4px;
 }
 .dynamic-widget-inline-controls__network-picker-main > button > svg {
  display:none;
  width:0

 }
 .dynamic-widget-inline-controls__network-picker.evm-network-control__container {
width:45px;

min-width:45px;
overflow-x:hidden;
padding-right:0;
padding-inline-end:0;
 }
 .dynamic-widget-inline-controls__network-picker-main {
    min-width: 45px;
}
 .dynamic-widget-inline-controls__network-picker.evm-network-control__container::after {
  content: "";
  display: block;
  width: 1px;
  height: 20px;
  position: absolute;
  background:#DCDBDD;
  top: 10px;
  right: 6px;
  pointer-events: none;
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
        address:
          authUser?.user?.verifiedCredentials[0]?.address?.toLowerCase() ?? "",
        username,
        starknetAddress,
      },
      {
        onSuccess: () => {
          setModalOpen(false);
          utils.auth.currentUser.invalidate();
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
              setAuthUser(params);
            },
            onLogout: () => handleDynamicLogout(),
          },
          cssOverrides,
        }}
      >
        <DynamicWagmiConnector>
          <PageLayout pageContext={pageContext}>{children}</PageLayout>
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

const DynamicCustomWidget = () => {
  const { user } = useDynamicContext();
  const isAuthorized = !!user;

  return isAuthorized ? (
    <AuthorizedUserView />
  ) : (
    <DynamicWidget
      innerButtonComponent="Connect"
      buttonClassName="connect-button"
      buttonContainerClassName="connect-button-container"
    />
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
      <TallyScript />
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
          Connect
        </Button>
      </InfoModal>

      <Drawer
        isOpen={isOpen}
        size={{ base: "full", md: "sm" }}
        placement="left"
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <Box position="absolute" top="16px" zIndex="12px">
            <IconButton
              aria-label="Close menu"
              onClick={onClose}
              variant="ghost"
              size="condensed"
              //todo replace with close icon
              icon={<div>X</div>}
            />
          </Box>
          <Box display={{ base: "none", lg: "flex" }}>
            {renderDone ? <DynamicCustomWidget /> : <Spinner size="sm" />}
          </Box>

          <DrawerBody px="12px" py="16px" pt="0" mt="48px">
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
            user={user}
          />
        </Layout.LeftAside>
        <Layout.Main>
          <Header>
            <Box display={{ base: "block", lg: "none" }}>
              <IconButton
                aria-label="Open menu"
                size="condensed"
                // toDo replace with x icon
                icon={isOpen ? <HamburgerIcon /> : <HamburgerIcon />}
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
            <Show breakpoint="(min-width: 834px)">
              <Box
                display={{ base: "flex", lg: "none" }}
                flex="1"
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Logo href="/" />
              </Box>
            </Show>

            <Box display="flex" marginLeft="auto">
              <ShareDialog />
            </Box>
            <Box display={{ base: "flex" }}>
              {renderDone ? <DynamicCustomWidget /> : <Spinner size="sm" />}
            </Box>
            <Box display={{ base: "none", lg: "none" }} marginLeft="auto">
              <IconButton
                aria-label="Open menu"
                size="condensed"
                icon={<FeedbackIcon />}
                onClick={onOpen}
                variant="feedback"
              />
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
  user?: IUser | null;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({
  pageContext,
  userRole,
  councilData,
  openSupportModal,
  user,
}) => {
  return (
    <>
      <Box mt="-20px">
        <NavGroup>
          <Show breakpoint="(max-width: 834px)">
            <Box alignItems={"center"} justifyContent={"center"}>
              <Logo href="/" />
            </Box>
          </Show>
          {[
            {
              href: "/",
              label: "Home",
              icon: <HomeIcon />,
              exact: true,
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
              active={
                item.exact
                  ? pageContext.urlOriginal === item.href
                  : pageContext.urlOriginal.startsWith(item.href)
              }
              icon={item.icon}
              label={item.label}
              key={item.href}
              href={item.href}
            />
          ))}
        </NavGroup>
      </Box>
      <NavGroup label="Councils">
        {councilData
          ?.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
          .map((council) => (
            <NavItem
              key={council.id}
              icon={
                council.name?.toLowerCase().startsWith("builder") ? (
                  <BuildersIcon />
                ) : (
                  <SecurityIcon />
                )
              }
              label={council.name ?? "Unknown"}
              href={council.slug ? `/councils/${council.slug}` : "/councils"}
              active={pageContext.urlOriginal.startsWith(
                `/councils/${council.slug}`,
              )}
            />
          ))}

        {hasPermission(userRole, [ROLES.ADMIN, ROLES.MODERATOR]) ? (
          <Link
            href="/councils/create"
            style={{ border: "none", marginLeft: "6px" }}
          >
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
            active={pageContext.urlOriginal.startsWith(item.href)}
            icon={item.icon}
            label={item.label}
            key={item.href}
            href={item.href}
          />
        ))}

        {user ? (
          <NavItem href="/settings" icon={<SettingsIcon />} label="Settings" />
        ) : null}
        <NavItem
          icon={<SupportIcon />}
          label="Support"
          onClick={openSupportModal}
        />

        <Box as="span" display={{ base: "none", lg: "flex" }}>
          <ChakraButton
            variant="feedback"
            leftIcon={<FeedbackIcon />}
            data-tally-open="3xMJly"
            data-tally-emoji-text="👋"
            data-tally-emoji-animation="wave"
            padding={"12px"}
            width={"100%"}
            justifyContent={"flex-start"}
          >
            Feedback
          </ChakraButton>
        </Box>
      </NavGroup>
    </>
  );
};
