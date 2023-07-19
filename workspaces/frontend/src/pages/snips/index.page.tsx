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
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";

export function Page() {
  const snips = trpc.snips.getAll.useQuery();
  const sortedSnips = snips.data?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Box>
      <BannerHome />

      <Box px={{ base: "26.5px", md: "76.5px" }} pt="40px">
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
        <ListRow.Container>
          {sortedSnips?.map((data) => (
            <ListRow.Root key={data.id} href={`/${data.type}s/${data.id}`}>
              <ListRow.MutedText id={data.id} type={data.type} />
              <ListRow.Title label={data.title} />
              {/* <ListRow.Date /> */}
              <Box display={{ base: "none", md: "flex" }}>
                <ListRow.Comments count={data.comments?.length ?? null} />
              </Box>
              <ListRow.Status status={data.status} />
            </ListRow.Root>
          ))}
        </ListRow.Container>
      </Box>
    </Box>
  );
}

export const documentProps = {
  title: "Core Snips",
} satisfies DocumentProps;
