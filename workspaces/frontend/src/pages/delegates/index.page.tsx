import { DocumentProps } from "src/renderer/types";

import {
  Box,
  AppBar,
  Button,
  SearchInput,
  DelegateCard,
  SimpleGrid,
  PageTitle,
  ButtonGroup,
  ContentContainer,
  HiAdjustmentsHorizontal,
  Popover,
  FilterPopoverContent,
  CheckboxFilter,
  useFilterState,
  FilterPopoverIcon,
  Select,
  Text,
} from "@yukilabs/governance-components";

import { trpc } from "src/utils/trpc";
import { useState } from "react";
{
  /* Filter: already voted, >1million voting power, agree with delegate agreement, category   */
}
export const delegateFilters = {
  defaultValue: ["already_voted"],
  options: [
    {
      label: "Delegate agreement",
      value: "delegate_agreement",
      count: 18,
    },
    {
      label: "More than 1m voting power",
      value: "more_then_1m_voting_power",
      count: 6,
    },
    {
      label: "1 or more votes",
      value: "1_or_more_votes",
      count: 9,
    },
    {
      label: "1 or more comments",
      value: "1_or_more_comments",
      count: 9,
    },
  ],
};
export const delegateInterests = {
  defaultValue: ["cairo_dev"],
  options: [
    {
      label: "Cairo Dev",
      value: "cairo_dev",
      count: 18,
    },
    {
      label: "DAOs",
      value: "daos",
      count: 6,
    },
    {
      label: "Governance",
      value: "governance",
      count: 9,
    },
    {
      label: "Identity",
      value: "identity",
      count: 9,
    },
    {
      label: "Infrastructure",
      value: "infrastructure",
      count: 9,
    },
    {
      label: "Legal",
      value: "legal",
      count: 9,
    },
    {
      label: "Professional delegate",
      value: "professional_delegate",
      count: 9,
    },
    {
      label: "Security",
      value: "security",
      count: 9,
    },
    {
      label: "Starknet community",
      value: "starknet_community",
      count: 9,
    },
    {
      label: "Web3 community",
      value: "web3_community",
      count: 9,
    },
    {
      label: "Web3 developer",
      value: "web3_developer",
      count: 9,
    },
  ],
};
{
  /* Sort by: most voting power, activity, most votes, most comments, by category  */
}
const sortByOptions = {
  defaultValue: "sort_by",
  options: [
    { label: "Random", value: "random" },
    { label: "Most voting power", value: "most_voting_power" },
    {
      label: "Most votes cast",
      value: "most_votes_cast",
    },

    { label: "Most comments", value: "most_comments" },
  ],
};

export function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const delegates = trpc.delegates.getAll.useQuery();
  trpc.auth.checkAuth.useQuery(undefined, {
    onError: () => {
      setIsAuthenticated(false);
    },
    onSuccess: () => {
      setIsAuthenticated(true);
    },
  });

  console.log(delegates?.data)

  const filteredDelegates = delegates?.data?.filter((data) =>
    data?.author?.address?.includes(searchQuery)
  );
  const state = useFilterState({
    defaultValue: delegateFilters.defaultValue,
    onSubmit: console.log,
  });

  return (
    <ContentContainer>
      <Box width="100%" maxWidth="1100px">
        <PageTitle
          learnMoreLink="/learn"
          title="Delegates"
          description="Starknet delegates vote to approve protocol upgrades on behalf of token holders, influencing the direction of the protocol."
        />
        <AppBar>
          <Box mr="8px">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Box>
          <ButtonGroup>
            {/* Sort by: most voting power, activity, most votes, most comments, by category  */}

            <Select
              size="sm"
              aria-label="Sort by"
              placeholder="Sort by"
              focusBorderColor={"red"}
              rounded="md"
            >
              {sortByOptions.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            {/* Filter: already voted, >1million voting power, agree with delegate agreement, category   */}

            <Popover placement="bottom-start">
              <FilterPopoverIcon
                label="Filter by"
                icon={HiAdjustmentsHorizontal}
              />
              <FilterPopoverContent
                isCancelDisabled={!state.canCancel}
                onClickApply={state.onSubmit}
                onClickCancel={state.onReset}
              >
                <Text mt="4" mb="2" fontWeight="bold">
                  Filters
                </Text>
                <CheckboxFilter
                  hideLabel
                  value={state.value}
                  onChange={(v) => state.onChange(v)}
                  options={delegateFilters.options}
                />
                <Text mt="4" mb="2" fontWeight="bold">
                  Interests
                </Text>
                <CheckboxFilter
                  hideLabel
                  value={state.value}
                  onChange={(v) => state.onChange(v)}
                  options={delegateInterests.options}
                />
              </FilterPopoverContent>
            </Popover>
          </ButtonGroup>

          {isAuthenticated && (
            <Box display="flex" marginLeft="auto">
              <Button as="a" href="/delegates/create" size="sm" variant="solid">
                Create delegate profile
              </Button>
            </Box>
          )}
        </AppBar>
        <SimpleGrid
          position="relative"
          width="100%"
          spacing={4}
          templateColumns="repeat(auto-fill, minmax(327px, 1fr))"
        >
          {filteredDelegates && filteredDelegates.length > 0 ? (
            filteredDelegates.map((data) => (
              <DelegateCard key={data.starknetWalletAddress} address={data?.author?.address} {...data} />
            ))
          ) : (
            <Box
              position="absolute"
              inset="0"
              display="flex"
              width="100%"
              height="300px"
              alignItems="center"
              justifyContent="center"
            >
              No results
            </Box>
          )}
        </SimpleGrid>
      </Box>
    </ContentContainer>
  );
}

export const documentProps = {
  title: "Delegates",
} satisfies DocumentProps;
