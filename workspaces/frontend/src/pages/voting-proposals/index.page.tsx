import { DocumentProps, ROLES } from "src/renderer/types";
import useIsMobile from "src/hooks/useIsMobile";
import {
  Box,
  AppBar,
  Button,
  PageTitle,
  ListRow,
  EmptyState,
  Skeleton,
  Text,
  FilterPopoverIcon,
  FilterPopoverContent,
  CheckboxFilter,
  Popover,
  useFilterState,
  Link,
  Flex,
  Select
} from "@yukilabs/governance-components";
import { Grid, PopoverContent,
  PopoverBody } from "@chakra-ui/react";
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
    <ListRow.Root
      key={data.id}
      href={`/voting-proposals/${data.id}`}
      flexDir={{
        base: "column",
        xl: "row",
      }}
      alignItems="center"
      py="standard.sm"
    >
      <Flex
        flex={{
          base: 1,
          md: "auto",
        }}
        flexDir={{
          base: "column",
          md: "row",
        }}
        alignItems={{
          base: "baseline",
          md: "center",
        }}
        width="100%"
      >
        <ListRow.Title label={data.title} flex={1} alignItems="center" />
        <Flex
          display={{ base: "flex" }}
          justifyContent={{
            base: "space-between",
          }}
          width={{
            base: "100%",
            md: "auto",
          }}
          alignItems="center"
          sx={{
            "> span": {
              flex: 1,
            },
          }}
        >
          {/* <ListRow.CategoryText category={data?.category || ""} /> */}
          <ListRow.VoteResults
            choices={
              data.choices
                ?.map((choice: any) => choice || "")
                ?.filter(Boolean) || []
            }
            scores={
              data.scores
                ?.map((score: any) => score || 0)
                ?.filter(Number.isFinite) || []
            }
            w={{
              base: "auto",
              md: "200px",
            }}
            maxW={{
              base: "none",
              md: "200px",
            }}
            ml={{
              base: "auto",
              md: "0px",
            }}
          />
          <ListRow.Status
            status={data.state}
            display={{
              base: "none",
              md: "flex",
            }}
          />
        </Flex>
      </Flex>
      <Flex
        width={{
          base: "100%",
          xl: "auto",
        }}
        alignItems="center"
      >
        <ListRow.Status
          status={data.state}
          display={{
            md: "none",
          }}
        />
        <Box display={{ base: "flex", md: "flex" }}>
          <ListRow.DateRange
            start={data.start}
            end={data.end}
            state={data.state}
          />
        </Box>
        <Box
          display={{ base: "flex", md: "flex" }}
          ml={{
            base: "auto",
            md: "0px",
          }}
        >
          <ListRow.Comments count={count} />
        </Box>
      </Flex>
    </ListRow.Root>
  );
}

export function Page() {
  const [sortBy, setSortBy] = useState<SortingTypes>("desc");
  const { user } = usePageContext();
  const state = useFilterState({
    defaultValue: statusFilters.defaultValue,
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

  const {
    data,
    isLoading: loading,
    isError: error,
    refetch,
  } = trpc.proposals.getProposals.useQuery({
    ...filtersState,
  });

  const { isMobile } = useIsMobile();
  function ActionButtons() {
    if (!hasPermission(user?.role, [ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.MODERATOR])) {
      return null;
    }
    return (
      <>
        <Button
          width={{ base: "100%", md: "auto" }}
          as="a"
          href="voting-proposals/create"
          size={isMobile ? "standard" : "condensed"}
          variant="primary"
        >
          Create proposal
        </Button>
      </>
    );
  }

  return (
    <Grid
      bg="surface.bgPage"
      templateColumns={{
        base: "1fr",
      }}
      templateAreas={{
        base: `
          "listcontent"
        `,
      }}
    >
      <Box
        gridArea="listcontent"
        px={{
          base: "standard.md",
          md: "standard.2xl",
        }}
        pt={{ base: "standard.2xl", lg: "standard.3xl" }}
        pb={{ base: "standard.2xl", lg: "standard.3xl" }}
      >
        <Box maxWidth={{ base: "100%", lg: "1240px" }} mx="auto">
          <PageTitle
            learnMoreLink="/learn"
            title="Voting proposals"
            standard={false}
            description="Starknet delegates vote to approve protocol upgrades on behalf of token holders, influencing the direction of the protocol. "
          />

          <AppBar.Root>
            <AppBar.Group mobileDirection="row" gap="standard.sm">
              <Box minWidth={"52px"}>
                <Text variant="mediumStrong" color="content.default.default">Sort by</Text>
              </Box>
              <Select
                size={isMobile ? "md" : "sm"}
                aria-label="All"
                placeholder="All"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortingTypes);
                  setFiltersState((prevState) => ({
                    ...prevState,
                    sortBy: e.target.value as SortingTypes,
                  }));
                  refetch();
                }}
                options={SORTING_OPTIONS.map((option) => ({
                  value: option.value,
                  label: option.label
                }
                ))}
              />
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
                  <Text mb="standard.sm" fontWeight="bold">
                    Status
                  </Text>
                  <CheckboxFilter
                    hideLabel
                    value={state.value}
                    onChange={(v) => state.onChange(v)}
                    options={statusFilters.options}
                  />
                </FilterPopoverContent>
              </Popover>
            </AppBar.Group>
            <AppBar.Group alignEnd>
              <ActionButtons />
            </AppBar.Group>
          </AppBar.Root>

          <Box position={"relative"}>
            <ListRow.Container>
              {loading ? (
                <VotingPropsSkeleton
                  numRows={10}
                  numSkeletonsPerRow={4}
                  firstSkeletonWidth="600%"
                />
              ) : error ? (
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
          <Flex justifyContent={"flex-end"} gap="standard.base" mt="standard.xl">
            <Text pt="1px" color="content.support.default" variant="small">
              Voting proposals powered by{" "}
            </Text>
            <Link
              size="small"
              href="https://snapshot.org/#/starknet.eth"
              isExternal
            >
              Snapshot
            </Link>
          </Flex>
        </Box>
      </Box>
    </Grid>
  );
}

export const documentProps = {
  title: "Proposals",
  image: "/social/social-proposal.png",
} satisfies DocumentProps;
