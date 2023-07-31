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
} from "@yukilabs/governance-components";
import { Suspense, lazy, useEffect, useState } from "react";
import { PageContext } from "./types";
import { trpc } from "src/utils/trpc";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import React from "react";
import { Spinner } from "@chakra-ui/react";

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

const DynamicWagmiConnectorPage = (props: Props) => {
  const { pageContext, children } = props;

  return (
    <DynamicWagmiConnector>
      <Suspense fallback={<p>Loading...</p>}>
        {(pageContext.hasLayout ?? true) === true ? (
          <PageLayout pageContext={pageContext}>{children}</PageLayout>
        ) : (
          children
        )}
      </Suspense>
    </DynamicWagmiConnector>
  );
};
export function DynamicContextProviderPage(props: Props) {
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
      <DynamicWagmiConnectorPage pageContext={pageContext}>
        {children}
      </DynamicWagmiConnectorPage>
    </DynamicContextProvider>
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
  const { children, pageContext } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const councilResp = trpc.councils.getAll.useQuery();
  const [renderDone, setRenderDone] = useState(false);

  useEffect(() => {
    if (renderDone) {
      setRenderDone(false);
      setTimeout(() => {
        setRenderDone(true);
      });
    } else {
      setRenderDone(true);
    }
  }, [props]);
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
              {renderDone ? <DynamicCustomWidget /> : <Spinner size="sm" />}
            </Box>
          </Header>
          <Layout.Content>{children}</Layout.Content>
        </Layout.Main>
      </Layout.Root>
    </>
  );
}
