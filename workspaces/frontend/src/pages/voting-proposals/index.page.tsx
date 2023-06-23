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
import { trpc } from "src/utils/trpc";

const GET_PROPOSALS = gql(`
query proposals($space: String!) {
  proposals(first: 20, skip: 0, where: {space: $space}, orderBy: "created", orderDirection: desc) {
    id
    title
    choices
    start
    end
    snapshot
    state
    scores
    scores_total
    author
    space {
      id
      name
    }
  }
}
  `);

function Proposal({ data }: any) {
  const comments = trpc.comments.getProposalComments.useQuery({
    proposalId: data.id,
  });

  const count = comments.data ? comments.data.length : 0;

  return (
    <ListRow.Root key={data.id} href={`/voting-proposals/${data.id}`}>
      <ListRow.MutedText id={1} type="vote" />
      <ListRow.Title label={data.title} />
      <ListRow.VoteResults
        choices={
          data.choices?.map((choice) => choice || "")?.filter(Boolean) || []
        }
        scores={
          data.scores?.map((score) => score || 0)?.filter(Number.isFinite) || []
        }
      />
      <ListRow.DateRange start={data.start} end={data.end} state={data.state} />
      <Box display={{ base: "none", md: "flex" }}>
        <ListRow.Comments count={count} />
      </Box>
      <ListRow.Status status={data.state} />
    </ListRow.Root>
  );
}

export function Page() {
  const { data } = useQuery(GET_PROPOSALS, {
    variables: {
      space: "robwalsh.eth",
    },
  });

  console.log(JSON.stringify(data?.proposals, null, 2));

  return (
    <Box px={{ base: "26.5px", md: "76.5px" }} pt="40px">
      <PageTitle
        learnMoreLink="/learn"
        title="Voting Proposals"
        description="Starknet voting proposals are official community votes on improvements to the core Starknet protocol. "
      />
      <AppBar>
        <Box mr="8px">
          <SearchInput placeholder="Search proposals..." />
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
          <Proposal key={data?.id} data={data} />
        ))}
      </ListRow.Container>
    </Box>
  );
}

export const documentProps = {
  title: "Proposals",
} satisfies DocumentProps;
