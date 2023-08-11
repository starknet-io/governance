import { DocumentProps } from "src/renderer/types";

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
  MarkdownRenderer,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useEffect, useState } from "react";
import { Page as PageInterface } from "@yukilabs/governance-backend/src/db/schema/pages";
import { User } from "@yukilabs/governance-backend/src/db/schema/users";
import { useDynamicContext } from "@dynamic-labs/sdk-react";

export interface PageWithUserInterface extends PageInterface {
  author: User | null;
}

export function Page() {
  const [selectedPage, setSelectedPage] =
    useState<PageWithUserInterface | null>(null);
  const pagesResp = trpc.pages.getAll.useQuery();
  const pages = pagesResp.data ?? [];

  const { user } = useDynamicContext();

  useEffect(() => {
    if (pages.length > 0) {
      setSelectedPage(pages[0]);
    }
  }, [pages]);

  const NavItemWrapper = ({ page }: { page: PageWithUserInterface }) => (
    <div onClick={() => setSelectedPage(page)}>
      <NavItem
        label={page.title ?? ""}
        activePage={selectedPage?.id === page.id}
        active="learn"
      />
    </div>
  );

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
        {user ? (
          <Button variant="outline" href="learn/create">
            Add new page
          </Button>
        ) : (
          <></>
        )}
      </Box>
      <ContentContainer maxWidth="800px" center>
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

              {user ? (
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
          <MarkdownRenderer content={selectedPage?.content ?? ""}/>
        </Stack>
      </ContentContainer>
    </Box>
  );
}

export const documentProps = {
  title: "Learn / home",
} satisfies DocumentProps;
