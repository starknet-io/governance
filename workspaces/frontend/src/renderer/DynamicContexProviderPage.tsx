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
  HiOutlineDocumentText,
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
      <ThemeProvider>
        <Suspense fallback={<p>Loading...</p>}>
          {(pageContext.hasLayout ?? true) === true ? (
            <PageLayout pageContext={pageContext}>{children}</PageLayout>
          ) : (
            children
          )}
        </Suspense>
      </ThemeProvider>
    </DynamicContextProvider>
  );
};

function PageLayout(props: Props) {
  const { children } = props;

  return (
    <Layout.Root>
      <Layout.LeftAside>
        <Logo />
        <NavItem href="/" icon={<MdOutlineHowToVote />} label="Proposals" />
        <NavItem href="/" icon={<MdOutlineAssignment />} label="Snips" />
        <NavItem
          icon={<HiOutlineUserCircle />}
          href="/delegates"
          label="Delegates"
        />
        <NavGroup label="Councils">
          <NavItem
            icon={<HiOutlineCodeBracketSquare />}
            label="Builders"
            href="/councils/builders"
          />
          <NavItem
            icon={<HiOutlineLockClosed />}
            label="Security"
            href="/councils/security"
          />
        </NavGroup>
        <NavGroup alignEnd>
          <NavItem icon={<HiOutlineAcademicCap />} label="Learn" />
          <NavItem icon={<HiOutlineQuestionMarkCircle />} label="Support" />
          <NavItem icon={<HiOutlineChatBubbleLeftRight />} label="Feedback" />
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
