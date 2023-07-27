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
  Skeleton,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useHelpMessage } from "src/hooks/HelpMessage";
import { useState } from "react";

export function Page() {
  const [, setHelpMessage] = useHelpMessage();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const snips = trpc.snips.getAll.useQuery();
  const sortedSnips = snips.data?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  trpc.auth.checkAuth.useQuery(undefined, {
    onError: () => {
      setIsAuthenticated(false);
    },
    onSuccess: () => {
      setIsAuthenticated(true);
    },
  });

  return (
    <Box>
      <BannerHome snipCount={sortedSnips?.length} />

      <Box px={{ base: "26.5px", md: "76.5px" }} pt="40px" pb="200px">
        <PageTitle
          learnMoreLink="/"
          title="Core SNIPs"
          description="Starknet Improvement Proposals are submitted by community members to pitch, discuss and obtain consensus on improvements to the core protocol. "
        />
        {sortedSnips && sortedSnips.length > 0 && (
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
              {isAuthenticated ? (
                <Button as="a" href="snips/create" size="sm" variant="solid">
                  Create SNIP
                </Button>
              ) : (
                <Button
                  onClick={() => setHelpMessage("connectWalletMessage")}
                  size="sm"
                  variant="solid"
                >
                  Create SNIP
                </Button>
              )}
            </Box>
          </AppBar>
        )}

        <Box position="relative">
          <ListRow.Container>
            {snips.isLoading ? (
              <SnipsSkeleton />
            ) : snips.isError ? (
              <Box position="absolute" inset="0" top="-25px" bg="#F9F8F9">
                <EmptyState
                  type="snips"
                  title="Something went wrong"
                  minHeight="300px"
                  action={
                    <Button variant="solid" onClick={() => snips.refetch()}>
                      Retry
                    </Button>
                  }
                />
              </Box>
            ) : sortedSnips && sortedSnips.length > 0 ? (
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
              <Box position="absolute" inset="0" top="-25px" bg="#F9F8F9">
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

const SnipsSkeleton = () => {
  return (
    <Box display="flex" flexDirection={"column"} gap="12px">
      <Box display="flex" flexDirection={"row"} gap="12px">
        <Skeleton height="68px" width="100%" />
      </Box>
      <Box display="flex" flexDirection={"row"} gap="12px">
        <Skeleton height="68px" width="500%" />
        <Skeleton height="68px" width="100%" />
        <Skeleton height="68px" width="100%" />
        <Skeleton height="68px" width="100%" />
      </Box>
      <Box display="flex" flexDirection={"row"} gap="12px">
        <Skeleton height="68px" width="500%" />
        <Skeleton height="68px" width="100%" />
        <Skeleton height="68px" width="100%" />
        <Skeleton height="68px" width="100%" />
      </Box>
      <Box display="flex" flexDirection={"row"} gap="12px">
        <Skeleton height="68px" width="500%" />
        <Skeleton height="68px" width="100%" />
        <Skeleton height="68px" width="100%" />
        <Skeleton height="68px" width="100%" />
      </Box>
    </Box>
  );
};
