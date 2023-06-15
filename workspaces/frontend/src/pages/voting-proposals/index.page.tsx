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
  const proposals = trpc.proposals.getAll.useQuery();

  return (
    <Box px={{ base: "26.5px", md: "76.5px" }} pt="40px">
      <PageTitle
        learnMoreLink="/learn"
        title="Voting Proposals"
        description="Starknet voting proposals are official community votes on improvements to the core Starknet protocol. "
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
          <Button
            as="a"
            href="voting-proposals/create"
            size="sm"
            variant="solid"
          >
            Create proposal
          </Button>
        </Box>
      </AppBar>
      <ListRow.Container>
        {proposals.data?.map((data) => (
          <ListRow.Root key={data.id} href={`/voting-proposals/1`}>
            <ListRow.MutedText id={data.id} type={data.type} />
            <ListRow.Title label={data.title} />
            {/* <ListRow.Date /> */}

            <ListRow.Comments count={0} />
            <ListRow.Status status={data.status} />
          </ListRow.Root>
        ))}
      </ListRow.Container>
    </Box>
  );
}

export const documentProps = {
  title: "Proposals",
} satisfies DocumentProps;
