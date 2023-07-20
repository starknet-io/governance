import { DocumentProps } from "src/renderer/types";

import {
  Box,
  AppBar,
  Button,
  PageTitle,
  ButtonGroup,
  ListRow,
  SearchInput,
  BannerHome,
  EmptyState,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";

export function Page() {
  const snips = trpc.snips.getAll.useQuery();
  const sortedSnips = snips.data?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Box>
      <BannerHome snipCount={sortedSnips?.length} />

      <Box px={{ base: "26.5px", md: "76.5px" }} pt="40px" pb="200px">
        <PageTitle
          learnMoreLink="/"
          title="Core SNIPs"
          description="Starknet Improvement Proposals are submitted by community members to pitch, discuss and obtain consensus on improvements to the core protocol. "
        />
        <AppBar>
          <Box mr="8px">
            <SearchInput />
          </Box>
          <ButtonGroup display={{ base: "none", md: "flex" }}>
            <Button as="a" href="/delegates/create" variant="outline">
              Filter by
            </Button>
            <Button as="a" href="/delegates/create" variant="outline">
              Sort
            </Button>
          </ButtonGroup>
          <Box display="flex" marginLeft="auto">
            <Button as="a" href="snips/create" size="sm" variant="solid">
              Create SNIP
            </Button>
          </Box>
        </AppBar>
        <Box position="relative">
          <ListRow.Container>
            {/* {sortedSnips?.map((data) => (
            <ListRow.Root key={data.id} href={`/${data.type}s/${data.id}`}>
              <ListRow.MutedText id={data.id} type={data.type} />
              <ListRow.Title label={data.title} />
              <Box display={{ base: "none", md: "flex" }}>
                <ListRow.CategoryText category={"category"} />
              </Box>


              <ListRow.Status status={data.status} />
              <Box display={{ base: "none", md: "flex" }}>
                <ListRow.Comments count={data.comments?.length ?? null} />
              </Box>
            </ListRow.Root>
          ))} */}

            {sortedSnips && sortedSnips.length > 0 ? (
              sortedSnips.map((data) => (
                <ListRow.Root key={data.id} href={`/${data.type}s/${data.id}`}>
                  <ListRow.MutedText id={data.id} type={data.type} />
                  <ListRow.Title label={data.title} />
                  <Box display={{ base: "none", md: "flex" }}>
                    <ListRow.CategoryText category={"category"} />
                  </Box>
                  {/* <ListRow.Date /> */}

                  <ListRow.Status status={data.status} />
                  <Box display={{ base: "none", md: "flex" }}>
                    <ListRow.Comments count={data.comments?.length ?? null} />
                  </Box>
                </ListRow.Root>
              ))
            ) : (
              <Box position="absolute" inset="0">
                <EmptyState
                  type="snips"
                  title="No snips"
                  minHeight="300px"
                  action={
                    <Button variant="solid" as="a" href="/snips/create">
                      Create first SNIP
                    </Button>
                  }
                />
              </Box>
            )}
          </ListRow.Container>
        </Box>
      </Box>
    </Box>
  );
}

export const documentProps = {
  title: "Core Snips",
} satisfies DocumentProps;
