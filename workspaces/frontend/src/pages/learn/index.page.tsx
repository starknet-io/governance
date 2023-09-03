import { DocumentProps, ROLES } from "src/renderer/types";

import {
  Box,
  ContentContainer,
  Stack,
  Heading,
  Flex,
  Stat,
  Button,
  NavItem,
  ProfileSummaryCard,
  MenuItem,
  Divider,
  CopyToClipboard,
  MarkdownRenderer,
  Skeleton,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useEffect, useMemo, useState } from "react";
import { Page as PageInterface } from "@yukilabs/governance-backend/src/db/schema/pages";
import { User } from "@yukilabs/governance-backend/src/db/schema/users";
import { usePageContext } from "src/renderer/PageContextProvider";
import { hasPermission } from "src/utils/helpers";

export interface PageWithUserInterface extends PageInterface {
  author: User | null;
}

export function Page() {
  const [selectedPage, setSelectedPage] =
    useState<PageWithUserInterface | null>(null);
  const pagesResp = trpc.pages.getAll.useQuery();
  const pages = useMemo(() => pagesResp.data ?? [], [pagesResp.data]);
  const isLoading = pagesResp.isLoading;
  const { user: loggedUser } = usePageContext();
  const pageContext = usePageContext();

  useEffect(() => {
    setSelectedPage(getPageFromURL());

    if (pages.length > 0 && !getPageFromURL()) {
      setSelectedPage(pages[0]);
    }
  }, [pages]);

  useEffect(() => {
    if (!pageContext.routeParams.slug && pages.length > 0) {
      window.history.pushState(null, "", `/learn/${pages[0]?.slug}`);
      if (pages.length > 0) {
        setSelectedPage(pages[0]);
      }
    }
  }, [pageContext.routeParams, pages]);

  const getPageFromURL = () => {
    const slug = window.location.pathname.split("/").pop();
    if (slug) {
      return pages.find((page) => page.slug === slug) || null;
    }
    return null;
  };

  const selectPage = (page: PageWithUserInterface) => {
    setSelectedPage(page);
    window.history.pushState(null, "", `/learn/${page.slug}`);
  };

  console.log(selectedPage);

  const NavItemWrapper = ({ page }: { page: PageWithUserInterface }) => {
    const url = `${window.location.origin}/learn/${page.slug}`;
    return (
      <div style={{ display: "flex" }}>
        <div style={{ width: "100%" }} onClick={() => selectPage(page)}>
          <NavItem
            label={page.title ?? ""}
            // activePage={selectedPage?.id === page.id}
            active={selectedPage?.id === page.id}
          />
        </div>
        <CopyToClipboard text={url} />
      </div>
    );
  };

  return (
    <Box
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      flex="1"
      height="100%"
      justifyContent="center"
    >
      <Box
        pt="40px"
        px="16px"
        borderRight="1px solid #E7E8E9"
        display="flex"
        flexDirection="column"
        flexBasis={{ base: "100%", md: "270px" }}
        position={{ base: "unset", lg: "sticky" }}
        height="calc(100vh - 80px)"
        top="0"
      >
        <Stack
          spacing="1px"
          direction={{ base: "column" }}
          color="#545464"
          mb="24px"
        >
          {pages.map((page: PageWithUserInterface) => (
            <NavItemWrapper key={page.id} page={page} />
          ))}
        </Stack>
        {hasPermission(loggedUser?.role, [ROLES.ADMIN, ROLES.MODERATOR]) ? (
          <Button variant="outline" href="/learn/create">
            Add new page
          </Button>
        ) : (
          <></>
        )}
      </Box>
      <ContentContainer maxWidth="800px" center>
        {!isLoading ? (
          <Stack
            width="100%"
            spacing="24px"
            direction={{ base: "column" }}
            color="#545464"
          >
            <Box display="flex" alignItems="center" width="100%">
              <Box
                display="flex"
                alignItems="center"
                width="100%"
                justifyContent="space-between"
              >
                <Heading
                  color="#33333E"
                  variant="h3"
                  maxWidth="90%"
                  lineHeight="1.4em"
                >
                  {selectedPage?.title ?? "Select a page"}
                </Heading>

                {hasPermission(loggedUser?.role, [
                  ROLES.ADMIN,
                  ROLES.MODERATOR,
                ]) ? (
                  <Box>
                    <ProfileSummaryCard.MoreActions>
                      <MenuItem as="a" href={`/learn/edit/${selectedPage?.id}`}>
                        Edit
                      </MenuItem>
                      <MenuItem>Delete</MenuItem>
                    </ProfileSummaryCard.MoreActions>
                  </Box>
                ) : (
                  <></>
                )}
              </Box>
            </Box>
            <Flex gap="16px" paddingTop="24px">
              <Stat.Root>
                <Stat.Text
                  label={
                    selectedPage?.author?.ensName ??
                    selectedPage?.author?.address.slice(0, 3) +
                      "..." +
                      selectedPage?.author?.address.slice(-3)
                  }
                />
              </Stat.Root>
              <Stat.Root>
                <Stat.Date date={selectedPage?.createdAt} />
              </Stat.Root>
            </Flex>
            <Divider mb="24px" />
            <MarkdownRenderer content={selectedPage?.content ?? ""} />
          </Stack>
        ) : (
          <Box
            display={"flex"}
            flexDirection="column"
            gap="12px"
            mb="24px"
            width="100%"
            bg="transparent"
          >
            <Skeleton height="36px" width="100%" />
            <Skeleton height="300px" width="100%" />
            <Skeleton height="36px" width="100%" />
            <Skeleton height="300px" width="100%" />
            <Skeleton height="300px" width="100%" />
          </Box>
        )}
      </ContentContainer>
    </Box>
  );
}

export const documentProps = {
  title: "Learn / home",
} satisfies DocumentProps;
