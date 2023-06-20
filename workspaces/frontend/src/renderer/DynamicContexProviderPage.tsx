import {
  DynamicContextProvider,
  DynamicWidget,
  UserProfile,
  Wallet,
  WalletConnector,
} from "@dynamic-labs/sdk-react";
import {
  HiOutlineAcademicCap,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCodeBracketSquare,
  HiOutlineLockClosed,
  HiOutlineQuestionMarkCircle,
  HiOutlineUserCircle,
  Logo,
  NavGroup,
  NavItem,
  ThemeProvider,
  Layout,
  Header,
  Box,
  MdOutlineHowToVote,
  MdOutlineAssignment,
} from "@yukilabs/governance-components";
import { Suspense, useEffect, useState } from "react";
import { PageContext } from "./types";
import { trpc } from "src/utils/trpc";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";

// need to move this override to a better place
const cssOverrides = `

  .button--padding-large {
    padding: 0.74rem 1rem;
    border-radius: 4px;
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

const DynamicContextProviderPage = (props: Props) => {
  const { pageContext, children } = props;
  const [authArgs, setAuthArgs] = useState<AuthSuccessParams | null>(null);
  const authMutation = trpc.auth.authUser.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();

  const authUser = async (args: AuthSuccessParams) => {
    authMutation.mutate({ authToken: args.authToken });
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

function PageLayout(props: Props) {
  const { children, pageContext } = props;

  return (
    <Layout.Root>
      <Layout.LeftAside>
        <Logo />
        <NavItem
          href="/voting-proposals"
          //todo: fix how active state for menu works
          active={pageContext.urlOriginal}
          icon={<MdOutlineHowToVote />}
          label="Voting proposals"
        />
        <NavItem
          active={pageContext.urlOriginal}
          href="/snips"
          icon={<MdOutlineAssignment />}
          label="SNIPs"
        />
        <NavItem
          icon={<HiOutlineUserCircle />}
          active={pageContext.urlOriginal}
          href="/delegates"
          label="Delegates"
        />
        <NavGroup label="Councils">
          <NavItem
            active={pageContext.urlOriginal}
            icon={<HiOutlineCodeBracketSquare />}
            label="Builders"
            href="/councils/builders"
          />
          <NavItem
            icon={<HiOutlineLockClosed />}
            active={pageContext.urlOriginal}
            label="Security"
            href="/councils/security"
          />
        </NavGroup>
        <NavGroup alignEnd>
          <NavItem
            href="/learn"
            active={pageContext.urlOriginal}
            icon={<HiOutlineAcademicCap />}
            label="Learn"
          />
          <NavItem
            active={pageContext.urlOriginal}
            icon={<HiOutlineQuestionMarkCircle />}
            label="Support"
          />
          <NavItem
            active={pageContext.urlOriginal}
            icon={<HiOutlineChatBubbleLeftRight />}
            label="Feedback"
          />
        </NavGroup>
      </Layout.LeftAside>
      <Layout.Main>
        <Header>
          <Box display="flex" marginLeft="auto">
            <DynamicWidget />
          </Box>
        </Header>
        <Layout.Content>{children}</Layout.Content>
      </Layout.Main>
    </Layout.Root>
  );
}

export default DynamicContextProviderPage;
