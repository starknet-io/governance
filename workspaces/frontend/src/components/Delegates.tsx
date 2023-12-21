import {
  Box,
  AppBar,
  Button,
  DelegateCard,
  SimpleGrid,
  PageTitle,
  Popover,
  FilterPopoverContent,
  CheckboxFilter,
  useFilterState,
  FilterPopoverIcon,
  Text,
  Heading,
  EmptyState,
  SkeletonCircle,
  SkeletonText,
  DelegateModal,
  ConfirmModal,
  StatusModal,
  Flex,
  ArrowRightIcon,
} from "@yukilabs/governance-components";
import { Select } from "@chakra-ui/react";
import { trpc } from "src/utils/trpc";
import { useEffect, useState } from "react";
import { useBalanceData } from "src/utils/hooks";
import { ethers } from "ethers";
import { useAccount, useWaitForTransaction } from "wagmi";
import { stringToHex } from "viem";
import { useDelegateRegistrySetDelegate } from "src/wagmi/DelegateRegistry";
import { usePageContext } from "src/renderer/PageContextProvider";
import { MINIMUM_TOKENS_FOR_DELEGATION } from "src/pages/delegates/profile/@id.page";
import InfiniteScroll from "react-infinite-scroll-component";
import { gql } from "src/gql";
import { useQuery } from "@apollo/client";
import { truncateAddress } from "@yukilabs/governance-components/src/utils";
import { useHelpMessage } from "src/hooks/HelpMessage";
import useIsMobile from "@yukilabs/governance-frontend/src/hooks/useIsMobile";
import { useCheckBalance } from "./useCheckBalance";
import { navigate } from "vite-plugin-ssr/client/router";

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
    {
      label: "Defi",
      value: "defi",
      count: 9,
    },
    {
      label: "Gaming",
      value: "gaming",
      count: 9,
    },
    {
      label: "NFT",
      value: "nft",
      count: 9,
    },
    {
      label: "Build",
      value: "build",
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
    { label: "Most voting power", value: "votingPower" },
    {
      label: "Most votes cast",
      value: "totalVotes",
    },
  ],
};

const LIMIT = 12;

export type DelegatesProps = {
  showFilers?: boolean;
  transformData?: (data: any) => any;
  showAllDeligatesLink?: boolean;
  disableFetch?: boolean;
};

const transformDataDefault = (data: any) => {
  return data;
};

export function Delegates({
  showFilers = true,
  showAllDeligatesLink = false,
  disableFetch = false,
  transformData = transformDataDefault,
}: DelegatesProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { address, isConnected } = useAccount();
  const [inputAddress, setInputAddress] = useState("");
  const receiverData = useBalanceData(inputAddress as `0x${string}`);
  const [isValidAddress, setIsValidAddress] = useState(true);
  const senderData = useBalanceData(address);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
  const [statusTitle, setStatusTitle] = useState<string>("");
  const [statusDescription, setStatusDescription] = useState<string>("");
  const [allDelegates, setAllDelegates] = useState([]);
  const [hasMoreDelegates, setHasMoreDelegates] = useState(true);
  const { isLoading, writeAsync } = useDelegateRegistrySetDelegate({
    address: import.meta.env.VITE_APP_DELEGATION_REGISTRY,
    chainId: parseInt(import.meta.env.VITE_APP_DELEGATION_CHAIN_ID),
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [txHash, setTxHash] = useState("");

  const [helpMessage, setHelpMessage] = useHelpMessage();
  // listen to txn with delegation hash
  const {
    isLoading: isDelegationLoading,
    isError: isDelegationError,
    isSuccess: isDelegationSuccess,
    error: delegationError,
  } = useWaitForTransaction({ hash: txHash as `0x${string}` });
  // handle delegation cases

  // handle delegation cases
  useEffect(() => {
    if (isDelegationLoading) {
      setIsStatusModalOpen(true);
      setStatusTitle("Delegating voting power");
      setStatusDescription("");
    }

    if (isDelegationError) {
      setIsStatusModalOpen(true);
      setStatusTitle("Delegating voting power failed");
      setStatusDescription(
        "An error occurred while processing your transaction.",
      );
    }

    if (isDelegationSuccess) {
      setIsStatusModalOpen(true);
      setStatusTitle("Voting power delegated successfully");
      setStatusDescription("");
    }
  }, [isDelegationLoading, isDelegationError, isDelegationSuccess]);

  const { data: votingPower } = useQuery(
    gql(`
    query VotingPower($voter: String!, $space: String!) {
      vp(voter: $voter, space: $space) {
        vp
        vp_by_strategy
        vp_state
      }
    }
  `),
    {
      variables: {
        space: import.meta.env.VITE_APP_SNAPSHOT_SPACE,
        voter: inputAddress,
      },
      skip: !inputAddress,
    },
  );

  const state = useFilterState({
    defaultValue: delegateFilters.defaultValue,
    onSubmit: (filters) => {
      setAllDelegates([]);
      setFiltersState({ ...filtersState, filters, limit: LIMIT, offset: 0 });
      setHasMoreDelegates(true);
    },
  });

  const [filtersState, setFiltersState] = useState({
    filters: [] as string[],
    searchQuery,
    limit: LIMIT,
    offset: 0,
    sortBy,
  });

  const addVotingPowerToReceiver = () => {
    if (delegates.data && delegates.data.length > 0) {
      const foundDelegate = delegates.data.find(
        (delegate) => delegate.author.address === receiverData.address,
      );
      if (votingPower?.vp?.vp) {
        return {
          ...receiverData,
          vp: votingPower?.vp?.vp,
        };
      }
      if (!foundDelegate) {
        return receiverData;
      } else {
        return {
          ...receiverData,
          vp: foundDelegate.votingInfo.votingPower,
        };
      }
    }
    return receiverData;
  };

  const delegates =
    trpc.delegates.getDelegatesWithSortingAndFilters.useQuery(filtersState);
  const { user } = usePageContext();
  const { checkUserBalance } = useCheckBalance(user?.address as `0x${string}`);
  const userDelegate = trpc.users.isDelegate.useQuery(
    {
      userId: user?.id || "",
    },
    {
      enabled: !!user?.id,
    },
  );

  const handleResetFilters = () => {
    state.onReset();
    setAllDelegates([]);
    setHasMoreDelegates(true);
    setFiltersState({ ...filtersState, filters: [], offset: 0, limit: LIMIT });
  };

  function ActionButtons() {
    if (!user) {
      return (
        <>
          <Button
            width={{ base: "100%", md: "auto" }}
            size={isMobile ? "standard" : "condensed"}
            variant="outline"
            onClick={() => setHelpMessage("connectWalletMessage")}
          >
            Delegate to address
          </Button>

          <Button
            width={{ base: "100%", md: "auto" }}
            size={isMobile ? "standard" : "condensed"}
            variant="primary"
            onClick={() => setHelpMessage("connectWalletMessage")}
          >
            Create delegate profile
          </Button>
        </>
      );
    }

    const delegateId = userDelegate?.data?.id;

    return (
      <>
        <Button
          width={{ base: "100%", md: "auto" }}
          size={isMobile ? "standard" : "condensed"}
          variant="outline"
          onClick={() => {
            if (
              parseFloat(senderData?.balance) < MINIMUM_TOKENS_FOR_DELEGATION
            ) {
              setIsStatusModalOpen(true);
              setStatusTitle("No voting power");
              setStatusDescription(
                `You do not have enough tokens in your account to delegate. You need at least ${MINIMUM_TOKENS_FOR_DELEGATION} token to delegate.`,
              );
              setIsOpen(false);
            } else {
              setIsOpen(true);
            }
          }}
        >
          Delegate to address
        </Button>

        {!delegateId ? (
          <Button
            width={{ base: "100%", md: "auto" }}
            size={isMobile ? "standard" : "condensed"}
            onClick={() => {
              checkUserBalance({
                onSuccess: () => {
                  navigate("/delegates/create");
                },
              });
            }}
            variant="primary"
          >
            Create delegate profile
          </Button>
        ) : (
          <Button
            width={{ base: "100%", md: "auto" }}
            as="a"
            href={`/delegates/profile/${delegateId!}`}
            size={isMobile ? "standard" : "condensed"}
            variant="primary"
          >
            View delegate profile
          </Button>
        )}
      </>
    );
  }

  useEffect(() => {
    if (delegates.data && !delegates.isLoading) {
      const newData = delegates.data.filter(
        (delegate) =>
          !allDelegates.some((existing) => existing.id === delegate.id),
      );
      if (!delegates.data.length) {
        setHasMoreDelegates(false);
      } else {
        setAllDelegates((prevDelegates) => [...prevDelegates, ...newData]);
        if (delegates.data.length < LIMIT) {
          setHasMoreDelegates(false);
        } else {
          setHasMoreDelegates(true);
        }
      }
    }
  }, [delegates.data, delegates.isLoading]);

  const fetchMoreData = () => {
    setFiltersState((prevState) => {
      const newOffset = prevState.offset + prevState.limit;
      return { ...prevState, offset: newOffset };
    });
  };

  const { isMobile } = useIsMobile();

  const sortedDelegateInterests = delegateInterests.options
    .slice(0)
    .sort((a, b) => {
      return a.label.localeCompare(b.label);
    });
  return (
    <>
      <DelegateModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setInputAddress("");
        }}
        isConnected={isConnected}
        isValidCustomAddress={isValidAddress}
        receiverData={
          !inputAddress.length ? undefined : addVotingPowerToReceiver()
        }
        onContinue={(address) => {
          const isValid = ethers.utils.isAddress(address);
          setIsValidAddress(isValid);
          if (isValid) {
            setInputAddress(address);
          }
        }}
        senderData={senderData}
        delegateTokens={() => {
          if (parseFloat(senderData?.balance) < MINIMUM_TOKENS_FOR_DELEGATION) {
            setIsStatusModalOpen(true);
            setStatusTitle("No voting power");
            setStatusDescription(
              `You do not have enough tokens in your account to delegate. You need at least ${MINIMUM_TOKENS_FOR_DELEGATION} token to delegate.`,
            );
            setIsOpen(false);
          } else {
            writeAsync?.({
              args: [
                stringToHex(import.meta.env.VITE_APP_SNAPSHOT_SPACE, {
                  size: 32,
                }),
                inputAddress as `0x${string}`,
              ],
            })
              .then((tx) => {
                setTxHash(tx.hash);
              })
              .catch((err) => {
                setIsStatusModalOpen(true);
                setStatusTitle("Delegating voting power failed");
                setStatusDescription(
                  err.shortMessage ||
                    err.message ||
                    err.name ||
                    "An error occurred",
                );
              });
            setIsOpen(false);
          }
        }}
      />
      <ConfirmModal isOpen={isLoading} onClose={() => setIsOpen(false)} />
      <StatusModal
        isOpen={isStatusModalOpen}
        isPending={isDelegationLoading}
        isSuccess={isDelegationSuccess}
        isFail={
          isDelegationError ||
          !!((!txHash || !txHash.length) && statusDescription?.length)
        }
        onClose={() => {
          setIsStatusModalOpen(false);
        }}
        title={statusTitle}
        description={statusDescription}
      />
      <Box width="100%">
        <Flex
          alignItems="flex-start"
          justifyContent="space-between"
          gap="standard.xl"
        >
          <PageTitle
            learnMoreLink={showAllDeligatesLink ? undefined : "/learn"}
            title="Delegates"
            description="Starknet delegates vote to approve protocol upgrades on behalf of token holders, influencing the direction of the protocol."
            maxW={showAllDeligatesLink ? "580px" : undefined}
            mb={0}
          />
          {showAllDeligatesLink && (
            <Button
              variant="outline"
              display="flex"
              gap="standard.xs"
              as="a"
              href="/delegates"
              px={{
                base: "standard.sm",
                lg: "standard.lg",
              }}
            >
              <Box
                display={{
                  base: "none",
                  lg: "block",
                }}
              >
                All delegates
              </Box>
              <ArrowRightIcon />
            </Button>
          )}
        </Flex>
        {showFilers && (
          <AppBar.Root>
            <AppBar.Group mobileDirection="row">
              <Box minWidth={"52px"}>
                <Text
                  variant="mediumStrong"
                  fontWeight="600"
                  color="content.default.default"
                >
                  Sort by
                </Text>
              </Box>
              <Select
                height={isMobile ? "44px" : "36px"}
                border="1px solid"
                borderColor="border.forms"
                aria-label="Random"
                placeholder="Random"
                focusBorderColor={"red"}
                rounded="md"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setAllDelegates([]);
                  setFiltersState((prevState) => ({
                    ...prevState,
                    offset: 0,
                    sortBy: e.target.value,
                  }));
                }}
              >
                {sortByOptions.options.map((option) => (
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
                  <Heading variant="h5">Filters</Heading>
                  <CheckboxFilter
                    hideLabel
                    value={state.value}
                    onChange={(v) => state.onChange(v)}
                    options={delegateFilters.options}
                  />
                  <Heading mt="standard.xs" variant="h5">
                    Interests
                  </Heading>
                  <CheckboxFilter
                    hideLabel
                    value={state.value}
                    onChange={(v) => state.onChange(v)}
                    options={sortedDelegateInterests}
                  />
                </FilterPopoverContent>
              </Popover>
            </AppBar.Group>

            <AppBar.Group alignEnd>
              <ActionButtons />
            </AppBar.Group>
          </AppBar.Root>
        )}
        {delegates.isLoading && !allDelegates?.length ? (
          <DelegatesSkeleton />
        ) : delegates.isError ? (
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
        ) : (
          <InfiniteScroll
            dataLength={allDelegates.length || 0} // This is important field to render the next data
            next={fetchMoreData} // A function which calls to fetch the next data
            hasMore={hasMoreDelegates && !disableFetch} // Boolean stating whether there are more data to load
            loader={null} // Loader to show before loading next set of data
            scrollThreshold={0.95} // adjust this value
          >
            <SimpleGrid
              position="relative"
              width="100%"
              spacing="standard.md"
              templateColumns="repeat(auto-fill, minmax(316px, 1fr))"
            >
              <>
                {allDelegates && allDelegates.length > 0 ? (
                  transformData?.(allDelegates)?.map((delegate) => (
                    <DelegateCard
                      onDelegateClick={() => {
                        if (user) {
                          if (
                            parseFloat(senderData?.balance) <
                            MINIMUM_TOKENS_FOR_DELEGATION
                          ) {
                            setIsStatusModalOpen(true);
                            setStatusTitle("No voting power");
                            setStatusDescription(
                              `You do not have enough tokens in your account to delegate. You need at least ${MINIMUM_TOKENS_FOR_DELEGATION} token to delegate.`,
                            );
                            setIsOpen(false);
                          } else {
                            setIsOpen(true);
                            setInputAddress(delegate?.author?.address);
                          }
                        } else {
                          setHelpMessage("connectWalletMessage");
                        }
                      }}
                      votingPower={delegate?.votingInfo?.votingPower}
                      profileURL={`/delegates/profile/${delegate.id}`}
                      address={delegate?.author?.address}
                      statement={delegate?.statement}
                      type={delegate?.interests as string[]}
                      src={
                        delegate?.author?.profileImage ??
                        delegate?.author?.ensAvatar ??
                        null
                      }
                      headerTooltipContent={
                        !delegate.author?.username && !delegate.author?.ensName
                          ? delegate.author?.address
                          : undefined
                      }
                      user={
                        delegate.author?.username ??
                        delegate.author?.ensName ??
                        truncateAddress(delegate.author?.address)
                      }
                      key={delegate?.id}
                      twitter={delegate?.twitter}
                      discord={delegate?.discord}
                      discourse={delegate?.discourse}
                      telegram={delegate?.telegram}
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
                {delegates.isLoading && allDelegates.length && (
                  <>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <Box key={index} padding="6" bg="#fff" borderRadius="8px">
                        <SkeletonCircle size="10" />
                        <SkeletonText
                          mt="4"
                          noOfLines={6}
                          spacing="4"
                          skeletonHeight="2"
                        />
                      </Box>
                    ))}
                  </>
                )}
              </>
            </SimpleGrid>
          </InfiniteScroll>
        )}
      </Box>
    </>
  );
}
type DelegatesSkeletonProps = {
  count?: number;
};
const DelegatesSkeleton = ({ count = 6 }: DelegatesSkeletonProps) => {
  return (
    <Box>
      <SimpleGrid
        position="relative"
        width="100%"
        spacing="standard.md"
        templateColumns="repeat(auto-fill, minmax(316px, 1fr))"
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
