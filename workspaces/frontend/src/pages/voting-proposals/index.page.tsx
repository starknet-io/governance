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
  Select,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const SORTING_OPTIONS = [
  { label: "Newest", value: "desc" },
  { label: "Oldest", value: "asc" },
  { label: "Most discussed", value: "most_discussed" },
];

type SortingTypes = "desc" | "asc" | "most_discussed" | "" | undefined;

function Proposal({ data }: any) {
  const comments = data.comments;
  const count = comments ? comments.length : 0;

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
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortingTypes>("desc");

  const {
    data,
    isLoading: loading,
    isError: error,
    refetch,
  } = trpc.proposals.getProposals.useQuery({
    searchQuery,
    sortBy,
  });

  console.log({ data });

  const debounce = useDebouncedCallback((query) => setSearchQuery(query), 500);

  const handleInputChange = (searchInput: string) => {
    setSearchInput(searchInput);
    debounce(searchInput);
  };

  return (
    <Box px={{ base: "26.5px", md: "76.5px" }} pt="40px" pb="200px">
      <PageTitle
        learnMoreLink="/learn"
        title="Voting Proposals"
        description="Starknet voting proposals are official community votes on improvements to the core Starknet protocol. "
      />
      {data && data.length > 0 && (
        <AppBar>
          <Box mr="8px">
            <SearchInput
              value={searchInput}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Search proposals..."
            />
          </Box>
          <ButtonGroup display={{ base: "none", md: "flex" }}>
            {/* Implement after next merge  */}
            {/* <Button as="a" href="/delegates/create" variant="outline">
              Filter by
            </Button> */}
            <Select
              size="sm"
              aria-label="All"
              placeholder="All"
              rounded="md"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortingTypes)}
            >
              {SORTING_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
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
                  <Button variant="solid" onClick={() => refetch}>
                    Retry
                  </Button>
                }
              />
            </Box>
          ) : data.length > 0 ? (
            data.map((item: any) => <Proposal key={item?.id} data={item} />)
          ) : (
            <Box position="absolute" inset="0">
              <EmptyState
                type="votes"
                title="No voting proposals"
                minHeight="300px"
                action={
                  <Button
                    variant="solid"
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
