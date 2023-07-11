import { DocumentProps } from "src/renderer/types";

import {
  Box,
  ContentContainer,
  Stack,
  Heading,
  Text,
  Flex,
  Stat,
  Button,
  NavItem,
  QuillEditor,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useEffect, useState } from "react";
import { Page as PageInterface } from "@yukilabs/governance-backend/src/db/schema/pages";

export function Page() {
  const [selectedPage, setSelectedPage] = useState<PageInterface | null>(null);
  const pagesResp = trpc.pages.getAll.useQuery();
  const pages = pagesResp.data ?? [];

  useEffect(() => {
    if (pages.length > 0) {
      setSelectedPage(pages[0]);
    }
  }, [pages]);

  const NavItemWrapper = ({ page }: { page: PageInterface }) => (
    <div onClick={() => setSelectedPage(page)}>
      <NavItem label={page.title ?? ""} />
    </div>
  );

  return (
    <Box
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      flex="1"
      height="100%"
    >
      <Box
        pt="40px"
        px="16px"
        borderRight="1px solid #E7E8E9"
        display="flex"
        flexDirection="column"
        flexBasis={{ base: "100%", md: "270px" }}
        height="100%"
      >
        <Stack
          spacing="12px"
          direction={{ base: "column" }}
          color="#545464"
          mb="24px"
        >
          {pages.map((page: PageInterface) => (
            <NavItemWrapper key={page.id} page={page} />
          ))}
        </Stack>
        {/* // show for admin role */}
        <Button variant="outline" href="learn/create">
          Add new page
        </Button>
      </Box>
      <Box ml="auto" mr="auto" pb="200px">
        <ContentContainer maxWidth="800px">
          <Stack spacing="24px" direction={{ base: "column" }} color="#545464">
            <Stack
              spacing="24px"
              direction={{ base: "column" }}
              color="#545464"
            >
              <Heading color="#33333E" variant="h3">
                {selectedPage?.title ?? "Select a page"}
              </Heading>
              <Flex gap="90px" paddingTop="24px">
                <Stat.Root>
                  <Stat.Label>Created on</Stat.Label>
                  <Stat.Text label="Jun 25, 2023, 5:00 PM" />
                </Stat.Root>

                <Stat.Root>
                  <Stat.Label>Created by</Stat.Label>
                  <Stat.Text label={"sylve.eth"} />
                </Stat.Root>
              </Flex>

              <QuillEditor value={selectedPage?.content ?? ""} readOnly />
            </Stack>
          </Stack>
        </ContentContainer>
      </Box>
    </Box>
  );
}

export const documentProps = {
  title: "Learn / home",
} satisfies DocumentProps;
