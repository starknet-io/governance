import { DocumentProps, ROLES } from "src/renderer/types";

import {
  Box,
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
  Username,
  Dropdown,
  Link,
  ArrowLeftIcon,
  ArrowRightIcon
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useEffect, useMemo, useState } from "react";
import { Page as PageInterface } from "@yukilabs/governance-backend/src/db/schema/pages";
import { User } from "@yukilabs/governance-backend/src/db/schema/users";
import { usePageContext } from "src/renderer/PageContextProvider";
import { hasPermission } from "src/utils/helpers";
import { PageWithChildren } from "@yukilabs/governance-backend/src/utils/buildLearnHierarchy";
import {
  EllipsisIcon,
  PlusIcon,
  ReOrderIcon,
} from "@yukilabs/governance-components/src/Icons/UiIcons";
import { truncateAddress } from "@yukilabs/governance-components/src/utils";
import { Grid } from "@chakra-ui/react";

export interface PageWithUserInterface extends PageInterface {
  author: User | null;
}

function findPageBySlug(data, slug) {
  // Base case: if data is undefined or an empty array
  if (!data || data.length === 0) {
    return null;
  }

  for (let i = 0; i < data.length; i++) {
    const item = data[i];

    // Check if the current item has the matching slug
    if (item.slug === slug) {
      return item;
    }

    // If the current item has children, search through them
    if (item.children && item.children.length > 0) {
      const found = findPageBySlug(item.children, slug);
      if (found) {
        return found;
      }
    }
  }

  // If no matching item is found, return null
  return null;
}

// Example usage:
const exampleResponse = [
  /* your data here */
];
const slug = "voting_proposals";
const result = findPageBySlug(exampleResponse, slug);
console.log(result); // Logs the object with slug 'voting_proposals', or null if not found

export function Page() {
  const [selectedPage, setSelectedPage] = useState<PageWithChildren | null>(
    null,
  );
  const pagesResp = trpc.pages.getAll.useQuery();
  const pages = useMemo(() => pagesResp.data ?? [], [pagesResp.data]);
  const isLoading = pagesResp.isLoading;
  const { user: loggedUser } = usePageContext();
  const pageContext = usePageContext();
  const [previousPage, setPreviousPage] = useState<PageWithChildren | null>(null)
  const [nextPage, setNextPage] = useState<PageWithChildren | null>(null)

  const { data: pagesTree } = trpc.pages.getPagesTree.useQuery();

  useEffect(() => {
    if (pagesTree && pagesTree?.length > 0) {
      const slug = pageContext?.routeParams?.slug;
      if (slug && slug.length) {
        const foundPage = findPageBySlug(pagesTree, slug);
        setSelectedPage(foundPage || pagesTree[0]);
      } else {
        setSelectedPage(pagesTree[0]);
      }
    }
  }, [pages]);

  function flattenPages(pages) {
    let flatPages = [];
  
    pages.sort((a, b) => a.orderNumber - b.orderNumber).forEach(page => {
      flatPages.push(page);
  
      if (page.children) {
        flatPages = flatPages.concat(flattenPages(page.children));
      }
    });
  
    return flatPages;
  }
  
  useEffect(() => {
    if (selectedPage && pagesTree) {
      const sortedPages = flattenPages(pagesTree);
      const currentPage = sortedPages.find(page => page.slug === selectedPage?.slug);
      const currentPageIndex = sortedPages.findIndex(page => page.slug === selectedPage?.slug);

      if (currentPage) {
        const previousPage = currentPageIndex > 0 ? sortedPages[currentPageIndex - 1] : null;
        const nextPage = currentPageIndex < sortedPages.length - 1 ? sortedPages[currentPageIndex + 1] : null;
  
        setPreviousPage(previousPage || null);
        setNextPage(nextPage || null);
      }
    }
  }, [selectedPage, pagesTree])

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
    window.scrollTo(0, 0);
  };

  const formattedAddress = truncateAddress(`${selectedPage?.author?.address}`);

  return (
    <Grid
      bg="surface.bgPage"
      templateColumns={{
        base: "1fr",
        md: "270px 1fr",
      }}
      templateAreas={{
        base: `
          "profile"
          "about"

        `,
        md: `
          "profile about"

        `,
      }}
    >
      <Box
        gridArea="profile"
        bg="surface.bgPage"
        borderRight={{ md: "1px solid" }}
        borderColor={{ md: "border.forms" }}
        minHeight="100%"
      >
        <Box
          position={{ md: "sticky" }}
          top={{ lg: "68px" }}
          bg="surface.bgPage"
          pt={{ base: "standard.md" }}
          pb={{ base: "standard.md", lg: "standard.3xl" }}
          // pr={{
          //   base: "standard.md",
          // }}
          pl={{
            base: "standard.md",
            md: "0px",
          }}
          borderBottom="1px solid"
          borderColor="border.forms"
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
          {hasPermission(loggedUser?.role, [
            ROLES.ADMIN,
            ROLES.SUPERADMIN,
            ROLES.MODERATOR,
            ROLES.AUTHOR,
          ]) && (
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
      </Box>
      <Box
        gridArea="about"
        px={{
          base: "standard.md",
          md: "standard.2xl",
        }}
        pt={{ base: "standard.2xl", lg: "standard.3xl" }}
        pb={{ base: "standard.2xl", lg: "standard.3xl" }}
        maxWidth="100%"
        overflow={"hidden"}
      >
        <Box maxWidth={{ base: "100%", lg: "626px" }} mx="auto">
          {!isLoading ? (
            <Stack width="100%" spacing="0" direction={{ base: "column" }}>
              <Box display="flex" alignItems="center" width="100%">
                <Box
                  display="flex"
                  alignItems="center"
                  width="100%"
                  justifyContent="space-between"
                  mb="standard.md"
                  position={"relative"}
                >
                  <Heading variant="h2" maxWidth="90%">
                    {selectedPage?.title ?? "Select a page"}
                  </Heading>

                  {hasPermission(loggedUser?.role, [
                    ROLES.ADMIN,
                    ROLES.MODERATOR,
                    ROLES.AUTHOR,
                    ROLES.SUPERADMIN,
                  ]) && (
                    <Box
                      width="44px"
                      height="44px"
                      position="absolute"
                      top="0"
                      right="0"
                    >
                      <Dropdown buttonIcon={<EllipsisIcon boxSize="20px" />}>
                        <MenuItem
                          as="a"
                          href={`/learn/edit/${selectedPage?.id}`}
                        >
                          Edit
                        </MenuItem>
                      </Dropdown>
                    </Box>
                  )}
                </Box>
              </Box>
              <Flex gap="standard.sm">
                {/* <Stat.Root>
                <Stat.Text
                  label={
                    selectedPage?.author?.username ??
                    selectedPage?.author?.ensName ??
                    selectedPage?.author?.address.slice(0, 3) +
                      "..." +
                      selectedPage?.author?.address.slice(-3)
                  }
                />
              </Stat.Root> */}
                <Username
                  address={selectedPage?.author?.address}
                  size="condensed"
                  src={
                    selectedPage?.author?.profileImage ??
                    selectedPage?.author?.ensAvatar ??
                    null
                  }
                  displayName={
                    selectedPage?.author?.username ??
                    selectedPage?.author?.ensName ??
                    formattedAddress
                  }
                  showTooltip={
                    selectedPage?.author?.username == "undefined" ||
                    selectedPage?.author?.ensName == "undefined"
                  }
                  tooltipContent={`${selectedPage?.author?.address}`}
                />
                <Text variant="small" color="content.default.default">
                  •
                </Text>

                <Stat.Root>
                  <Stat.Date date={selectedPage?.createdAt} />
                </Stat.Root>
              </Flex>
              <Divider mt="standard.xl" />
              <Box mt="standard.2xl" mb="standard.md">
                <MarkdownRenderer content={selectedPage?.content ?? ""} />
              </Box>
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
        </Box>
        <Flex
          pt="standard.md"
          justifyContent={!previousPage ? "flex-end" : "space-between"}
          alignItems="flex-start"
          alignSelf="stretch"
          borderTop="1px solid"
          borderColor="border.dividers"
        >
          {previousPage ? <Flex
            direction="column"
            alignItems="flex-start"
            gap="standard.2xs"
          >
            <Text variant="captionSmallStrong" color="content.accent.default">Prev</Text>
            <Flex
              py="standard.base"
              px="0"
              alignItems="center"
              gap="standard.2xs"
            >
              <Link
                variant="primary"
                size="medium"
                onClick={() => selectPage(previousPage)}
              >
                <ArrowLeftIcon width="18px" height="18px" />
                {previousPage.title}
              </Link>
            </Flex>
          </Flex> : null}
          {nextPage ? <Flex
            direction="column"
            alignItems="flex-end"
            gap="standard.2xs"
          >
            <Text variant="captionSmallStrong" color="content.accent.default">Next</Text>
            <Flex
              py="standard.base"
              px="0"
              alignItems="center"
              gap="standard.2xs"
            >
              <Link
                variant="primary"
                size="medium"
                onClick={() => selectPage(nextPage)}
                textAlign="right"
              >
                {nextPage.title}
                <ArrowRightIcon width="18px" height="18px" />
              </Link>
            </Flex>
          </Flex> : null}
        </Flex>
      </Box>
    </Grid>
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
    <Box>
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
  const fontSize = isChild ? "12px" : "14px";
  const isChildTree = pl && Number(pl) == 5;

  return (
    <Button
      onClick={() => selectPage(page)}
      variant="learnNavLink"
      fontWeight="medium"
      fontSize={fontSize}
      size="learnNavLink"
      width="100%"
      wordBreak={"break-word"}
      isActive={isSelectedPage}
      paddingLeft={isChildTree ? "standard.2xl" : "standard.md"}
      mb="2px"
    >
      {(isChild ? (
        <Flex pl="standard.xs">
          <Flex>{`-`}</Flex>

          <Flex pl="standard.xs">{page.title}</Flex>
        </Flex>
      ) : (
        page.title
      )) ?? ""}
    </Button>
  );
}

export const documentProps = {
  title: "Learn / home",
  image: "/social/social-learn.png",
} satisfies DocumentProps;
