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
  EmptyState,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  DelegateModal,
  ConfirmModal,
  Flex,
} from "@yukilabs/governance-components";

// import { useDebouncedCallback } from "use-debounce";

import { trpc } from "src/utils/trpc";
import { useState } from "react";
import { useBalanceData } from "../../utils/hooks";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { stringToHex } from "viem";
import { useDelegateRegistrySetDelegate } from "../../wagmi/DelegateRegistry";
import { usePageContext } from "src/renderer/PageContextProvider";
{
  /* Filter: already voted, >1million voting power, agree with delegate agreement, category   */
}

export const delegateNames = {
  cairo_dev: "Cairo Dev",
  daos: "DAOs",
  governance: "Governance",
  identity: "Identity",
  infrastructure: "Infrastructure",
  legal: "Legal",
  professional_delegate: "Professional delegate",
  security: "Security",
  starknet_community: "Starknet community",
  web3_community: "Web3 community",
  web3_developer: "Web3 developer",
};

export const delegateFilters = {
  defaultValue: [] as string[],
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
  defaultValue: [] as string[],
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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { address, isConnected } = useAccount();
  const [inputAddress, setInputAddress] = useState("");
  const receiverData = useBalanceData(inputAddress as `0x${string}`);
  const [isValidAddress, setIsValidAddress] = useState(true);
  const senderData = useBalanceData(address);
  const { isLoading, write } = useDelegateRegistrySetDelegate({
    address: import.meta.env.VITE_APP_DELEGATION_REGISTRY,
    chainId: parseInt(import.meta.env.VITE_APP_DELEGATION_CHAIN_ID),
  });
  // const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  const state = useFilterState({
    defaultValue: delegateFilters.defaultValue,
    onSubmit: (filters) => {
      setFiltersState({ ...filtersState, filters });
    },
  });

  const [filtersState, setFiltersState] = useState({
    filters: [] as string[],
    // searchQuery,
    sortBy,
  });

  const delegates =
    trpc.delegates.getDelegateByFiltersAndSort.useQuery(filtersState);

  const { user } = usePageContext();

  // const debounce = useDebouncedCallback(
  //   (searchQuery: string) => setFiltersState({ ...filtersState, searchQuery }),
  //   500,
  // );

  // const handleSearchInput = (input: string) => {
  //   setSearchQuery(input);
  //   debounce(input);
  // };

  const handleResetFilters = () => {
    state.onReset();
    setFiltersState({ ...filtersState, filters: [] });
  };
  // console.log(JSON.stringify(delegates.data, null, 2));

  function ActionButtons() {
    if (!user) {
      return null;
    }

    return (
      <>
        <Button
          size="condensed"
          variant="outline"
          onClick={() => setIsOpen(true)}
        >
          Delegate to address
        </Button>

        {!user.delegationStatement && (
          <Button
            as="a"
            href="/delegates/create"
            size="condensed"
            variant="primary"
          >
            Create delegate profile
          </Button>
        )}
      </>
    );
  }

  return (
    <ContentContainer>
      <DelegateModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isConnected={isConnected}
        isValidCustomAddress={isValidAddress}
        receiverData={!inputAddress.length ? undefined : receiverData}
        onContinue={(address) => {
          const isValid = ethers.utils.isAddress(address);
          setIsValidAddress(isValid);
          if (isValid) {
            setInputAddress(address);
          }
        }}
        senderData={senderData}
        delegateTokens={() => {
          write?.({
            args: [
              stringToHex(import.meta.env.VITE_APP_SNAPSHOT_SPACE, {
                size: 32,
              }),
              inputAddress as `0x${string}`,
            ],
          });
          setIsOpen(false);
        }}
      />
      <ConfirmModal isOpen={isLoading} onClose={() => setIsOpen(false)} />
      <Box width="100%">
        <PageTitle
          learnMoreLink="/learn"
          title="Delegates"
          description="Starknet delegates vote to approve protocol upgrades on behalf of token holders, influencing the direction of the protocol."
        />
        {delegates.isLoading ? (
          <DelegatesSkeleton />
        ) : delegates.isError ? (
          <Box position="absolute" inset="0" top="-25px" bg="#F9F8F9">
            <EmptyState
              type="delegates"
              title="Something went wrong"
              minHeight="300px"
              action={
                <Button variant="primary" onClick={() => delegates.refetch()}>
                  Retry
                </Button>
              }
            />
          </Box>
        ) : (
          <>
            <AppBar>
              {/* <Box mr="8px">
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                />
              </Box> */}
              <Flex flexDirection={"row"} gap="4px" alignItems={"center"}>
                <Text variant="medium">Sort by</Text>
                <Select
                  size="md"
                  aria-label="Sort by"
                  placeholder="Sort by"
                  focusBorderColor={"red"}
                  rounded="md"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortByOptions.options.map((option) => (
                    <option key={option.value} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Flex>
              <ButtonGroup display={{ base: "none", md: "flex" }}>
                <Popover placement="bottom-start">
                  <FilterPopoverIcon
                    label="Filter by"
                    icon={HiAdjustmentsHorizontal}
                    badgeContent={filtersState.filters.length}
                  />
                  <FilterPopoverContent
                    isCancelDisabled={!state.canCancel}
                    onClickApply={state.onSubmit}
                    onClickCancel={handleResetFilters}
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
              <Box display="flex" marginLeft="auto" gap="12px">
                <ActionButtons />
              </Box>
            </AppBar>
            <SimpleGrid
              position="relative"
              width="100%"
              spacing={4}
              templateColumns="repeat(auto-fill, minmax(327px, 1fr))"
            >
              {delegates.data && delegates.data.length > 0 ? (
                delegates.data.map((data) => (
                  <DelegateCard
                    onDelegateClick={() => console.log("test")}
                    profileURL={`/delegates/profile/${data.id}`}
                    ensName={data.author?.ensName}
                    key={data.author?.starknetAddress}
                    address={data?.author?.address}
                    avatarUrl={data.author?.ensAvatar}
                    delegateStatement={data?.delegateStatement}
                    delegatedVotes={"todo"}
                    delegateType={data?.delegateType as string[]}
                  />
                ))
              ) : (
                <Box position="absolute" inset="0">
                  <EmptyState
                    type="delegates"
                    title="No delegates yet"
                    minHeight="300px"
                  />
                </Box>
              )}
            </SimpleGrid>
          </>
        )}
      </Box>
    </ContentContainer>
  );
}
type DelegatesSkeletonProps = {
  count?: number;
};
const DelegatesSkeleton = ({ count = 6 }: DelegatesSkeletonProps) => {
  return (
    <Box>
      <Box display={"flex"} gap="12px" bg="#fff" padding="12px" mb="24px">
        <Skeleton height="24px" width="40%" />
        <Skeleton height="24px" width="40%" />
        <Skeleton height="24px" width="40%" />
        <Skeleton height="24px" width="100%" />
      </Box>

      <SimpleGrid
        position="relative"
        width="100%"
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(327px, 1fr))"
      >
        {Array.from({ length: count }).map((_, index) => (
          <Box key={index} padding="6" bg="#fff" borderRadius="8px">
            <SkeletonCircle size="10" />
            <SkeletonText mt="4" noOfLines={6} spacing="4" skeletonHeight="2" />
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export const documentProps = {
  title: "Delegates",
} satisfies DocumentProps;
