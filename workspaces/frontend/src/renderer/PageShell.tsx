import React, { Suspense, useEffect } from "react";
import { PageContextProvider } from "./PageContextProvider";
import type { PageContext } from "./types";
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
  Heading,
  Connect,
  Box,
} from "@yukilabs/governance-components";
import { TrpcProvider } from "./TrpcProvider";

interface Props {
  readonly pageContext: PageContext;
  readonly children: React.ReactNode;
}

export function PageShell(props: Props) {
  const { pageContext, children } = props;

  useEffect(() => {
    const documentProps =
      pageContext.documentProps ?? pageContext.exports.documentProps;

    document.title = documentProps?.title ?? document.title;
  }, [pageContext.pageProps]);

  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <TrpcProvider>
          <ThemeProvider>
            <Suspense fallback={<p>Loading...</p>}>
              {(pageContext.hasLayout ?? true) === true ? (
                <PageLayout pageContext={pageContext}>{children}</PageLayout>
              ) : (
                children
              )}
            </Suspense>
          </ThemeProvider>
        </TrpcProvider>
      </PageContextProvider>
    </React.StrictMode>
  );
}

function PageLayout(props: Props) {
  const { children } = props;

  return (
    <Layout.Root>
      <Layout.LeftAside>
        <Logo />
        <NavItem href="/" icon={<HiOutlineDocumentText />} label="Proposals" />
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
          <Heading variant="h3">Page.title</Heading>
          <Box display="flex" marginLeft="auto">
            <Connect address="0x2456...5678" isConnected={true} />
          </Box>
        </Header>

        {children}
      </Layout.Main>
    </Layout.Root>
  );
}
