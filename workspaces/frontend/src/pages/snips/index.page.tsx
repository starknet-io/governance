import { DocumentProps } from "src/renderer/types";

import {
  Box,
  AppBar,
  Button,
  PageTitle,
  ButtonGroup,
  ListRow,
  SearchInput,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";

export function Page() {
  const snips = trpc.snips.getAll.useQuery();

  return (
    <Box px={{ base: "26.5px", md: "76.5px" }} pt="40px">
      <PageTitle
        learnMoreLink="/"
        title="SNIPs"
        description="Starknet Improvement Proposals are submitted by community members to pitch, discuss and obtain consensus on improvements to the core protocol. "
      />
      <AppBar>
        <Box mr="8px">
          <SearchInput />
        </Box>
        <ButtonGroup>
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
        {snips.data?.map((data) => (
          <ListRow.Root key={data.id} href={`/${data.type}s/${data.id}`}>
            <ListRow.MutedText id={data.id} type={data.type} />
            <ListRow.Title label={data.title} />
            {/* <ListRow.Date /> */}

            <ListRow.Comments count={data.comments?.length ?? null} />
            <ListRow.Status status={data.status} />
          </ListRow.Root>
        ))}
      </ListRow.Container>
    </Box>
  );
}

export const documentProps = {
  title: "Core Snips",
} satisfies DocumentProps;
