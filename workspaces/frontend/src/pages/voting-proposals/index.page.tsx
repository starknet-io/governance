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
  EmptyState,
  Skeleton,
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
      <Box display={{ base: "none", md: "none" }}>
        <ListRow.MutedText id={1} type="vote" />
      </Box>
      <ListRow.Title label={data.title} />
      <Box display={{ base: "none", md: "flex" }}>
        <ListRow.CategoryText category={"category"} />
      </Box>
      <ListRow.VoteResults
        choices={
          data.choices?.map((choice: any) => choice || "")?.filter(Boolean) ||
          []
        }
        scores={
          data.scores
            ?.map((score: any) => score || 0)
            ?.filter(Number.isFinite) || []
        }
      />
      <Box display={{ base: "none", md: "flex" }}>
        <ListRow.DateRange
          start={data.start}
          end={data.end}
          state={data.state}
        />
      </Box>
      <ListRow.Status status={data.state} />
      <Box display={{ base: "none", md: "flex" }}>
        <ListRow.Comments count={count} />
      </Box>
    </ListRow.Root>
  );
}

export function Page() {
  const { data, loading, error, refetch } = useQuery(GET_PROPOSALS, {
    variables: {
      space: import.meta.env.VITE_APP_SNAPSHOT_SPACE,
    },
  });

  return (
    <Box px={{ base: "26.5px", md: "76.5px" }} pt="40px" pb="200px">
      <PageTitle
        learnMoreLink="/learn"
        title="Voting Proposals"
        description="Starknet voting proposals are official community votes on improvements to the core Starknet protocol. "
      />
      {data?.proposals && data?.proposals.length > 0 && (
        <AppBar>
          <Box mr="8px">
            <SearchInput placeholder="Search proposals..." />
          </Box>
          <ButtonGroup display={{ base: "none", md: "flex" }}>
            <Button
              as="a"
              href="/delegates/create"
              variant="outline"
              size="condensed"
            >
              Filter by
            </Button>
            <Button
              as="a"
              href="/delegates/create"
              variant="outline"
              size="condensed"
            >
              Sort
            </Button>
          </ButtonGroup>
          <Box display="flex" marginLeft="auto">
            <Button
              as="a"
              href="voting-proposals/create"
              size="condensed"
              variant="primary"
            >
              Create proposal
            </Button>
          </Box>
        </AppBar>
      )}
      <Box position={"relative"}>
        <ListRow.Container>
          {loading ? (
            <VotingPropsSkeleton />
          ) : error ? (
            <Box position="absolute" inset="0" top="-25px" bg="#F9F8F9">
              <EmptyState
                type="votes"
                title="Something went wrong"
                minHeight="300px"
                action={
                  <Button variant="primary" onClick={() => refetch}>
                    Retry
                  </Button>
                }
              />
            </Box>
          ) : data?.proposals && data?.proposals.length > 0 ? (
            data?.proposals.map((data) => (
              <Proposal key={data?.id} data={data} />
            ))
          ) : (
            <Box position="absolute" inset="0">
              <EmptyState
                type="votes"
                title="No voting proposals"
                minHeight="300px"
                action={
                  <Button
                    variant="primary"
                    as="a"
                    href="/voting-proposals/create"
                  >
                    Create first voting proposal
                  </Button>
                }
              />
            </Box>
          )}
        </ListRow.Container>
      </Box>
    </Box>
  );
}

export const documentProps = {
  title: "Proposals",
} satisfies DocumentProps;

const VotingPropsSkeleton = () => {
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
      <Box display="flex" flexDirection={"row"} gap="12px">
        <Skeleton height="68px" width="500%" />
        <Skeleton height="68px" width="100%" />
        <Skeleton height="68px" width="100%" />
        <Skeleton height="68px" width="100%" />
      </Box>
    </Box>
  );
};
