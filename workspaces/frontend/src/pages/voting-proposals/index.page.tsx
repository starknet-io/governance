import { useQuery } from "@apollo/client";
import { gql } from "src/gql/gql";
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

const GET_PROPOSALS = gql(`
query proposals {
  proposals(first: 20, skip: 0, where: {space_in: ["starknet.eth"]}, orderBy: "created", orderDirection: desc) {
    id
    title
    body
    choices
    start
    end
    snapshot
    state
    author
    space {
      id
      name
    }
  }
}

  `);



export function Page() {
  const {data} = useQuery(GET_PROPOSALS);

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

        {data?.proposals?.map((data) => (
          <ListRow.Root key={data!.id} href={`/voting-proposals/${data!.id}`}>
            <ListRow.MutedText id={1} type="vote" />
            <ListRow.Title label={data!.title} />
            <ListRow.Date />

            <ListRow.Comments count={0} />
            <ListRow.Status status={data!.state!} />
          </ListRow.Root>
        ))}
      </ListRow.Container>
    </Box>
  );
}

export const documentProps = {
  title: "Proposals",
} satisfies DocumentProps;
