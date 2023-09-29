import { DocumentProps, ROLES } from "src/renderer/types";

import {
  Box,
  AppBar,
  Button,
  PageTitle,
  ListRow,
  EmptyState,
  Skeleton,
  Select,
  Text,
  FilterPopoverIcon,
  FilterPopoverContent,
  CheckboxFilter,
  Popover,
  useFilterState,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useState } from "react";
import { usePageContext } from "src/renderer/PageContextProvider";
import { hasPermission } from "src/utils/helpers";

interface SkeletonRowProps {
  numItems: number;
  width: string;
}

const SkeletonRow = ({ numItems, width }: SkeletonRowProps) => (
  <Box display="flex" flexDirection={"row"} gap="12px">
    <Skeleton height="68px" width={width} />
    {Array.from({ length: numItems }).map((_, index) => (
      <Skeleton key={index} height="68px" width="100%" />
    ))}
  </Box>
);

const statusFilters = {
  defaultValue: [] as string[],
  options: [
    {
      value: "active",
      label: "Active",
      count: 9,
    },
    {
      value: "pending",
      label: "Pending",
      count: 9,
    },
    {
      value: "closed",
      label: "Closed",
      count: 9,
    },
  ],
};

const categoriesFilters = {
  defaultValue: [] as string[],
  options: [
    {
      value: "category1",
      label: "Category1",
      count: 9,
    },
    {
      value: "category2",
      label: "Category2",
      count: 9,
    },
    {
      value: "category3",
      label: "Category3",
      count: 9,
    },
  ],
};

interface VotingPropsSkeletonProps {
  numRows?: number;
  numSkeletonsPerRow?: number;
  firstSkeletonWidth?: string;
}

export const VotingPropsSkeleton = ({
  numRows = 9,
  numSkeletonsPerRow = 3,
  firstSkeletonWidth = "500%",
}: VotingPropsSkeletonProps) => {
  return (
    <Box display="flex" flexDirection={"column"} gap="12px">
      {Array.from({ length: numRows }).map((_, rowIndex) => (
        <SkeletonRow
          key={rowIndex}
          numItems={numSkeletonsPerRow}
          width={firstSkeletonWidth}
        />
      ))}
    </Box>
  );
};

const SORTING_OPTIONS = [
  { label: "Newest", value: "desc" },
  { label: "Oldest", value: "asc" },
  { label: "Most discussed", value: "most_discussed" },
];

type SortingTypes = "desc" | "asc" | "most_discussed" | "" | undefined;

export function Proposal({ data }: any) {
  const comments = data.comments;
  const count = comments ? comments.length : 0;

  return (
    <ListRow.Root key={data.id} href={`/voting-proposals/${data.id}`}>
      <Box display={{ base: "none", md: "none" }}>
        <ListRow.MutedText id={1} type="vote" />
      </Box>
      <ListRow.Title label={data.title} />
      <Box display={{ base: "none", md: "flex" }}>
        <ListRow.CategoryText category={data?.category || ""} />
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
  const [sortBy, setSortBy] = useState<SortingTypes>("desc");
  const { user } = usePageContext();
  const state = useFilterState({
    defaultValue: categoriesFilters.defaultValue,
    onSubmit: (filters) => {
      setFiltersState({ ...filtersState, filters });
    },
  });

  const [filtersState, setFiltersState] = useState({
    filters: [] as string[],
    sortBy,
  });

  const handleResetFilters = () => {
    state.onReset();
    setFiltersState({ ...filtersState, filters: [] });
  };

  console.log("filtersState", filtersState);
  const {
    data,
    isLoading: loading,
    isError: error,
    refetch,
  } = trpc.proposals.getProposals.useQuery({
    ...filtersState,
  });

  function ActionButtons() {
    if (!hasPermission(user?.role, [ROLES.ADMIN, ROLES.MODERATOR])) {
      return null;
    }

    return (
      <>
        <Button
          width={{ base: "100%", md: "auto" }}
          as="a"
          href="voting-proposals/create"
          size="condensed"
          variant="primary"
        >
          Create proposal
        </Button>
      </>
    );
  }

  return (
    <Box px={{ base: "26.5px", md: "76.5px" }} pt="40px" pb="200px">
      <PageTitle
        learnMoreLink="/learn"
        title="Voting Proposals"
        description="Starknet delegates vote to approve protocol upgrades on behalf of token holders, influencing the direction of the protocol. "
      />
      {data && data.length > 0 && (
        <AppBar.Root>
          <AppBar.Group mobileDirection="row">
            <Box minWidth={"52px"}>
              <Text variant="mediumStrong">Sort by</Text>
            </Box>
            <Select
              size="sm"
              aria-label="All"
              placeholder="All"
              rounded="md"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortingTypes);
                setFiltersState((prevState) => ({
                  ...prevState,
                  sortBy: e.target.value as SortingTypes,
                }));
                refetch();
              }}
            >
              {SORTING_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Popover placement="bottom-start">
              <FilterPopoverIcon
                label="Filter by"
                badgeContent={filtersState.filters.length}
              />
              <FilterPopoverContent
                isCancelDisabled={!state.canCancel}
                onClickApply={state.onSubmit}
                onClickCancel={handleResetFilters}
              >
                <Text mt="4" mb="2" fontWeight="bold">
                  Status
                </Text>
                <CheckboxFilter
                  hideLabel
                  value={state.value}
                  onChange={(v) => state.onChange(v)}
                  options={statusFilters.options}
                />
                <Text mt="4" mb="2" fontWeight="bold">
                  Categories
                </Text>
                <CheckboxFilter
                  hideLabel
                  value={state.value}
                  onChange={(v) => state.onChange(v)}
                  options={categoriesFilters.options}
                />
              </FilterPopoverContent>
            </Popover>
          </AppBar.Group>
          <AppBar.Group alignEnd>
            <ActionButtons />
          </AppBar.Group>
        </AppBar.Root>
      )}
      <Box position={"relative"}>
        <ListRow.Container>
          {loading ? (
            <VotingPropsSkeleton
              numRows={10}
              numSkeletonsPerRow={4}
              firstSkeletonWidth="600%"
            />
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
