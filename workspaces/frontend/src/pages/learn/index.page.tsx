import { DocumentProps, ROLES } from "src/renderer/types";

import {
  Box,
  ContentContainer,
  Stack,
  Heading,
  Flex,
  Stat,
  Button,
  ProfileSummaryCard,
  MenuItem,
  Divider,
  MarkdownRenderer,
  Skeleton,
  Text,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useEffect, useMemo, useState } from "react";
import { Page as PageInterface } from "@yukilabs/governance-backend/src/db/schema/pages";
import { User } from "@yukilabs/governance-backend/src/db/schema/users";
import { usePageContext } from "src/renderer/PageContextProvider";
import { hasPermission } from "src/utils/helpers";
import { PageWithChildren } from "@yukilabs/governance-backend/src/utils/buildLearnHierarchy";
import {
  PlusIcon,
  ReOrderIcon,
} from "@yukilabs/governance-components/src/Icons/UiIcons";

export interface PageWithUserInterface extends PageInterface {
  author: User | null;
}

export function Page() {
  const [selectedPage, setSelectedPage] = useState<PageWithChildren | null>(
    null,
  );
  const pagesResp = trpc.pages.getAll.useQuery();
  const pages = useMemo(() => pagesResp.data ?? [], [pagesResp.data]);
  const isLoading = pagesResp.isLoading;
  const { user: loggedUser } = usePageContext();
  const pageContext = usePageContext();

  const { data: pagesTree } = trpc.pages.getPagesTree.useQuery();

  useEffect(() => {
    if (pagesTree && pagesTree?.length > 0) {
      setSelectedPage(pagesTree[0]);
    }
  }, [pages]);

  useEffect(() => {
    if (!pageContext.routeParams.slug && pages.length > 0) {
      window.history.pushState(null, "", `/learn/${pages[0]?.slug}`);
      if (pages.length > 0) {
        setSelectedPage(pagesTree?.[0] ?? null);
      }
    }
  }, [pageContext.routeParams, pagesTree]);

  const selectPage = (page: PageWithChildren) => {
    setSelectedPage(page);
    window.history.pushState(null, "", `/learn/${page.slug}`);
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
        pt="20px"
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
          mb="1"
        >
          <LearnPageTree
            isLoading={isLoading}
            selectedPage={selectedPage}
            selectPage={selectPage}
            pages={pagesTree}
          />
        </Stack>
        {hasPermission(loggedUser?.role, [ROLES.ADMIN, ROLES.MODERATOR]) && (
          <Flex pl="2">
            <Button
              height="44px"
              width="44px"
              variant="ghost"
              href="/learn/reorder"
              p="4"
            >
              <ReOrderIcon />
            </Button>
            <Button
              height="44px"
              width="44px"
              variant="ghost"
              href="/learn/create"
              p="0"
            >
              <PlusIcon />
            </Button>
          </Flex>
        )}
      </Box>
      <ContentContainer maxWidth="800px" center>
        {!isLoading ? (
          <Stack width="100%" spacing="0" direction={{ base: "column" }}>
            <Box display="flex" alignItems="center" width="100%">
              <Box
                display="flex"
                alignItems="center"
                width="100%"
                justifyContent="space-between"
                mb="standard.md"
              >
                <Heading variant="h2" maxWidth="90%">
                  {selectedPage?.title ?? "Select a page"}
                </Heading>

                {hasPermission(loggedUser?.role, [
                  ROLES.ADMIN,
                  ROLES.MODERATOR,
                ]) && (
                  <Box>
                    <ProfileSummaryCard.MoreActions>
                      <MenuItem as="a" href={`/learn/edit/${selectedPage?.id}`}>
                        Edit
                      </MenuItem>
                    </ProfileSummaryCard.MoreActions>
                  </Box>
                )}
              </Box>
            </Box>
            <Flex gap="standard.sm">
              <Stat.Root>
                <Stat.Text
                  label={
                    selectedPage?.author?.username ??
                    selectedPage?.author?.ensName ??
                    selectedPage?.author?.address.slice(0, 3) +
                      "..." +
                      selectedPage?.author?.address.slice(-3)
                  }
                />
              </Stat.Root>
              <Text variant="small" color="content.default.default">
                •
              </Text>

              <Stat.Root>
                <Stat.Date date={selectedPage?.createdAt} />
              </Stat.Root>
            </Flex>
            <Divider mt="standard.xl" />
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

interface LearnPageTreeProps {
  selectedPage: PageWithChildren | null;
  isLoading: boolean;
  pages?: PageWithChildren[];
  selectPage: (page: PageWithChildren) => void;
  pl?: number;
  depth?: number;
  isChildTree?: boolean;
}

function LearnPageTree({
  isLoading = true,
  pages = [],
  selectedPage,
  selectPage,
  depth = 0,
}: LearnPageTreeProps) {
  const mainDepth = depth + 1;

  if (isLoading) {
    return (
      <Box
        display={"flex"}
        flexDirection="column"
        gap="8px"
        mb="24px"
        px="2"
        width="100%"
        bg="transparent"
      >
        <Skeleton height="42px" width="100%" />
        <Skeleton height="40px" width="100%" />
        <Skeleton height="40px" width="100%" />
        <Skeleton height="42px" width="100%" />
        <Skeleton height="40px" width="100%" />
        <Skeleton height="40px" width="100%" />
      </Box>
    );
  }

  return (
    <Box pr="2">
      {pages.map((page) => (
        <Box key={page.id}>
          <NavItemWrapper
            pl={`${mainDepth}`}
            page={page}
            isChild={mainDepth > 1}
            selectPage={selectPage}
            selectedPage={selectedPage}
          />
          {page.children && (
            <LearnPageTree
              isChildTree={mainDepth > 1}
              isLoading={isLoading}
              selectedPage={selectedPage}
              selectPage={selectPage}
              pages={page.children}
              depth={mainDepth + 1}
            />
          )}
        </Box>
      ))}
    </Box>
  );
}

interface NavItemWrapperProps {
  page: PageWithChildren;
  isChild?: boolean;
  pl?: string;
  selectedPage: PageWithChildren | null;
  selectPage: (page: PageWithChildren) => void;
}

function NavItemWrapper({
  page,
  isChild = false,
  pl,
  selectedPage,
  selectPage,
}: NavItemWrapperProps) {
  const isSelectedPage = selectedPage?.id === page.id;
  const fontSize = isChild ? "xs" : "sm";
  const fontColor = isSelectedPage ? "#1A1523" : "#4A4A4F";

  return (
    <Box
      onClick={() => selectPage(page)}
      pl={pl}
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        width: "2px",
        height: "70%",
        backgroundColor: isSelectedPage ? "#1A1523" : "transparent",
        left: 0,
        top: "50%",
        transform: "translateY(-50%)",
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
      }}
    >
      <Button
        variant="ghost"
        fontWeight="medium"
        fontSize={fontSize}
        color={fontColor}
        size="navLink"
        width="100%"
      >
        {(isChild ? `- ${page.title}` : page.title) ?? ""}
      </Button>
    </Box>
  );
}

export const documentProps = {
  title: "Learn / home",
} satisfies DocumentProps;
