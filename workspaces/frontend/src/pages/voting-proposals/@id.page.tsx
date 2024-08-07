import { DocumentProps } from "src/renderer/types";
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  ConfirmModal,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  InfoModal,
  PlaceholderImage,
  Stat,
  SummaryItems,
  Text,
  Textarea,
  VoteButton,
  Modal,
  VoteReview,
  VoteStat,
  StatusModal,
  Iframely,
  VoteComment,
  MarkdownRenderer,
  Banner,
  EllipsisIcon,
  Link,
  EmptyState,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Username,
  PastVote,
  WrongAccountOrNetworkModal,
} from "@yukilabs/governance-components";
import * as VoteLayout from "../../components/VotingProposals/VotingProposal/PageLayout";
import { usePageContext } from "src/renderer/PageContextProvider";
import { formatDate } from "@yukilabs/governance-components/src/utils/helpers";
import { useWalletClient } from "wagmi";
import { providers } from "ethers";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { trpc } from "src/utils/trpc";
import { useBalanceData } from "src/utils/hooks";
import { truncateAddress } from "@yukilabs/governance-components/src/utils";
import { MINIMUM_TOKENS_FOR_DELEGATION } from "../delegates/profile/@id.page";
import {
  SuccessIcon,
  WalletIcon,
} from "@yukilabs/governance-components/src/Icons";
import { Button as ChakraButton, Select, SimpleGrid } from "@chakra-ui/react";
import { BackButton } from "src/components/Header/BackButton";
import { useHelpMessage } from "src/hooks/HelpMessage";
import VotingProposalComments from "../../components/VotingProposals/VotingProposalComments/VotingProposalComments";
import { useVotes } from "../../hooks/snapshotX/useVotes";
import { AUTHENTICATORS_ENUM } from "../../hooks/snapshotX/constants";
import { useSpace } from "../../hooks/snapshotX/useSpace";
import {
  ethSigClient,
  starknetEvmClient,
  starkProvider,
  starkSigClient,
} from "../../clients/clients";
import {
  processStrategiesMetadata,
  useVotingPower,
} from "../../hooks/snapshotX/useVotingPower";
import {
  parseStrategiesMetadata,
  prepareStrategiesForSignature,
  waitForTransaction,
} from "../../hooks/snapshotX/helpers";
import { useL1StarknetDelegationDelegates } from "../../wagmi/L1StarknetDelegation";
import { useWallets } from "../../hooks/useWallets";
import { useStarknetDelegates } from "../../hooks/starknet/useStarknetDelegates";
import { useStarknetBalance } from "../../hooks/starknet/useStarknetBalance";
import { getChecksumAddress } from "starknet";
import { useProposal } from "../../hooks/snapshotX/useProposal";
import { useActiveStarknetAccount } from "../../hooks/starknet/useActiveStarknetAccount";

export function Page() {
  const pageContext = usePageContext();
  const { data: walletClient } = useWalletClient();
  const [helpMessage, setHelpMessage] = useHelpMessage();
  const { ethWallet, starknetWallet } = useWallets();
  const { primaryWallet, setPrimaryWallet } = useDynamicContext();
  const { data: stats } = trpc.stats.getStats.useQuery();

  const isL1Voting = ethWallet?.id === primaryWallet?.id;
  const isL2Voting = starknetWallet?.id === primaryWallet?.id;

  const { data, refetch } = useProposal({
    proposal: pageContext.routeParams!.id,
  });

  const { data: votingPower, isLoading: votingPowerLoading } = useVotingPower({
    address: ethWallet?.address as string,
    proposal: data?.proposal?.id,
  });

  const { data: votingPowerL2, isLoading: votingPowerLoadingL2 } =
    useVotingPower({
      address: starknetWallet?.address as string,
      proposal: data?.proposal?.id,
    });

  const vote = useVotes({
    proposal: pageContext.routeParams!.id.toString(),
    voter: ethWallet?.address,
    skipField: "voter",
  });

  const l2Address = starknetWallet?.address
    ? getChecksumAddress(starknetWallet?.address).toLowerCase()
    : null;

  const voteL2 = useVotes({
    proposal: pageContext.routeParams!.id,
    voter: l2Address,
    skipField: "voter",
  });
  const space = useSpace();
  const processedStrategies = processStrategiesMetadata(
    space?.data?.strategies_parsed_metadata,
    space?.data?.strategies_indicies,
  );
  const parsedVotingStrategies = parseStrategiesMetadata(
    processedStrategies || [],
  ).join(", ");

  const { data: votes } = useVotes({
    proposal: pageContext.routeParams!.id,
    skipField: "proposal",
  });

  const address = ethWallet?.address;

  const delegation = useL1StarknetDelegationDelegates({
    address: import.meta.env.VITE_APP_STARKNET_REGISTRY,
    args: [address!],
    watch: true,
    enabled: address != null,
  });

  const delegationDataL1 = delegation?.data;

  const { delegates: delegationDataL2 } = useStarknetDelegates({
    starknetAddress: starknetWallet?.address,
  });

  const userBalance = useBalanceData(address);
  const starknetBalance = useStarknetBalance({
    starknetAddress: starknetWallet?.address,
  });

  const { data: commentCountData } =
    trpc.proposals.getProposalCommentCount.useQuery({
      id: pageContext.routeParams!.id,
    });

  const activeStarknetWallet = useActiveStarknetAccount();
  const [isWrongAccount, setIsWrongAccount] = useState<boolean>(false);

  async function handleVote(choice: number, reason?: string) {
    try {
      if (
        (isL1Voting && votingPower < MINIMUM_TOKENS_FOR_DELEGATION) ||
        (isL2Voting && votingPowerL2 < MINIMUM_TOKENS_FOR_DELEGATION)
      ) {
        setIsStatusModalOpen(true);
        setStatusTitle("No voting power");
        setStatusDescription(
          `You do not have enough tokens in your account to vote. You need at least ${MINIMUM_TOKENS_FOR_DELEGATION} tokens to vote.`,
        );
        setIsOpen(false);
        return;
      }
      setIsOpen(false);
      setisConfirmOpen(true);

      const strategiesMetadata = space.data.strategies_parsed_metadata.map(
        (strategy) => ({
          ...strategy.data,
        }),
      );
      const preparedStrategies = await prepareStrategiesForSignature(
        space.data.strategies as string[],
        strategiesMetadata as any[],
        space?.data?.strategies_indicies || [],
      );

      let convertedChoice = 1;

      if (choice === 2) {
        convertedChoice = 0;
      }
      if (choice === 3) {
        convertedChoice = 2;
      }
      const params = {
        authenticator:
          primaryWallet?.id === ethWallet?.id
            ? AUTHENTICATORS_ENUM.EVM_SIGNATURE
            : AUTHENTICATORS_ENUM.STARKNET_TRANSACTION,
        space: space.data.id,
        proposal: parseInt(pageContext.routeParams.id!),
        choice: convertedChoice,
        strategies: preparedStrategies,
      };


      const starknetProvider = starkProvider;

      const deeplink = walletConnector?.getDeepLink();
      if (deeplink) {
        window.location.href = deeplink;
      }
      let receipt = null;
      if (primaryWallet?.id === ethWallet?.id) {
        if (!walletClient) {
          setStatusTitle("Voting failed");
          setStatusDescription("Ethereum account not connected");
          return false;
        }
        const web3 = new providers.Web3Provider(walletClient.transport);

        receipt = await ethSigClient.vote({
          signer: web3.getSigner(),
          data: params,
        });
      } else {
        if (typeof window !== "undefined") {
          const isBraavos = starknetWallet?.connector?.name === "Braavos";
          let activeStarknetAccount = null;
          if (isBraavos) {
            activeStarknetAccount = window?.starknet_braavos?.account;
          } else {
            activeStarknetAccount = window?.starknet?.account;
          }
          receipt = await starknetEvmClient.vote(activeStarknetAccount, {
            data: params,
          });
        }
      }
      let transaction = null;
      let transactionHash = null;
      if (!receipt?.transaction_hash) {
        transaction = await starkSigClient.send(receipt);
        transactionHash = transaction.transaction_hash;
      } else {
        transactionHash = receipt.transaction_hash;
      }
      if (!transactionHash) {
        setStatusTitle("Voting failed");
        setStatusDescription("An error occurred");
        return false;
      }
      await waitForTransaction(transactionHash);
      setisConfirmOpen(false);
      setisSuccessModalOpen(true);
      await refetch();
      await vote.refetch();
      await voteL2.refetch();
      //await votes.refetch();
    } catch (error: any) {
      // Handle error
      console.error(error);
      setIsStatusModalOpen(true);
      setStatusTitle("Voting failed");
      setStatusDescription(
        error?.error_description || error?.error || "An error occurred",
      );
      setisConfirmOpen(false);
    }
  }

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [isConfirmOpen, setisConfirmOpen] = useState(false);
  const [isSuccessModalOpen, setisSuccessModalOpen] = useState(false);
  const [currentChoice, setcurrentChoice] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
  const [statusTitle, setStatusTitle] = useState<string>("");
  const [statusDescription, setStatusDescription] = useState<string>("");
  const [isConnectedModal, setIsConnectedModal] = useState<boolean>(false);
  const { user, setShowAuthFlow, walletConnector } = useDynamicContext();
  //const hasVoted = vote.data && vote.data.votes?.[0];
  const hasVoted = false;
  const canVote = true;
  //const canVote =
  //  data?.proposal?.state === "active" && votingPower > 0 && !hasVoted;

  const delegateOwnProfileL1 =
    delegationDataL1?.toLowerCase() === ethWallet?.address?.toLowerCase();
  const delegateOwnProfileL2 =
    getChecksumAddress(delegationDataL2?.toLowerCase() || "") ===
    getChecksumAddress(starknetWallet?.address?.toLowerCase() || "");
  const hasDelegatedOnL2 =
    delegationDataL2 && delegationDataL2.length && !delegateOwnProfileL2;
  const hasDelegatedOnL1 =
    delegationDataL1 &&
    delegationDataL1.length &&
    delegationDataL1 !== "0x0000000000000000000000000000000000000000" &&
    !delegateOwnProfileL1;
  const hasVotedL1 = vote.data && vote.data.votes?.[0];
  const hasVotedL2 = voteL2.data && voteL2.data.votes?.[0];

  const canVoteL1 =
    data?.proposal?.state === "active" &&
    votingPower > 0 &&
    !hasVotedL1 &&
    !hasDelegatedOnL1;
  const canVoteL2 =
    data?.proposal?.state === "active" &&
    votingPowerL2 > 0 &&
    !hasVotedL2 &&
    !hasDelegatedOnL2;

  const hasDelegated = false;
  const shouldShowHasDelegated = hasDelegated && !hasVoted && !canVote;
  const showPastVotes = votes?.votes && votes?.votes?.length > 0;
  const pastVotes = votes?.votes || [];
  const { data: authorInfo } = trpc.users.getUser.useQuery({
    address: data?.proposal?.author || "",
  });
  const pastVotesWithUserInfo = pastVotes.map((pastVote) => {
    return {
      ...pastVote,
      author: pastVote?.author?.author || {},
    };
  });

  /*

  useEffect(() => {
    comments.refetch();
  }, [user?.isAuthenticatedWithAWallet]);

   */

  useEffect(() => {
    if (user) {
      setIsConnectedModal(false);
    }
  }, [user]);

  type MoreActionsProps = {
    children: React.ReactNode;
  };
  const MoreActions = ({ children }: MoreActionsProps) => {
    return (
      <Box style={{ position: "relative" }}>
        <Menu>
          <MenuButton as={IconButton} icon={<EllipsisIcon />} variant="ghost" />

          <Box top="0px" position="relative">
            <MenuList>{children}</MenuList>
          </Box>
        </Menu>
      </Box>
    );
  };

  const delegatedTo = trpc.delegates.getDelegateByAddress.useQuery({
    address: delegationDataL1,
  });
  const delegatedToL2 = trpc.delegates.getDelegateByAddress.useQuery(
    {
      address: delegationDataL2,
    },
    {
      enabled: !!delegationDataL2,
    },
  );

  const renderBannerBasedOnDelegation = () => {
    if (hasDelegatedOnL1 && !hasDelegatedOnL2) {
      return (
        <>
          Your voting power of {userBalance.balance} {userBalance.symbol} is
          currently assigned to delegate{" "}
          <Link
            fontSize="small"
            fontWeight="normal"
            href={`/delegates/profile/${delegatedTo?.data?.delegationStatement?.id}`}
          >
            {truncateAddress(delegation.data! || "")}
          </Link>
        </>
      );
    } else if (hasDelegatedOnL2 && !hasDelegatedOnL1) {
      return (
        <>
          Your voting power of {starknetBalance?.balance?.balance}{" "}
          {starknetBalance?.balance?.symbol} is currently assigned to delegate{" "}
          <Link
            fontSize="small"
            fontWeight="normal"
            href={`/delegates/profile/${delegatedToL2?.data?.delegationStatement?.id}`}
          >
            {truncateAddress(delegationDataL2 || "")}
          </Link>
        </>
      );
    } else if (hasDelegatedOnL2 && hasDelegatedOnL1) {
      return (
        <>
          Your voting power of {starknetBalance?.balance?.balance}{" "}
          {starknetBalance?.balance?.symbol} is currently assigned to delegate{" "}
          <Link
            fontSize="small"
            fontWeight="normal"
            href={`/delegates/profile/${delegatedToL2?.data?.delegationStatement?.id}`}
          >
            {truncateAddress(delegationDataL2 || "")}
          </Link>{" "}
          and {userBalance.balance} {userBalance.symbol} is currently assigned
          to delegate{" "}
          <Link
            fontSize="small"
            fontWeight="normal"
            href={`/delegates/profile/${delegatedTo?.data?.delegationStatement?.id}`}
          >
            {truncateAddress(delegation.data! || "")}
          </Link>
        </>
      );
    } else {
      return <></>;
    }
  };

  const formatPercentageForVotes = () => {
    if (!stats?.totalVoters) {
      return 0;
    }
    const allVoters = stats?.totalVoters || 0;
    const total = ((pastVotes?.length * 1.0) / allVoters) * 100.0;
    return `${total.toFixed(4)}%`;
  };

  const formatPercentageForVotingPower = () => {
    if (!stats?.totalVotingPower) {
      return 0;
    }
    const totalVotes = data?.proposal?.scores_total;
    const allVotingPower = stats?.totalVotingPower || 0;
    const total = ((totalVotes * 1.0) / allVotingPower) * 100.0;
    return `${total.toFixed(7)}%`;
  };

  return (
    <>
      <Modal
        title="Confirm Vote"
        isOpen={isOpen}
        maxHeight={"80%"}
        onClose={() => setIsOpen(false)}
        size="md"
      >
        {hasVotedL1 ? (
          <PastVote
            voteCount={votingPower as number}
            choice={vote.data.votes[0].choice}
          />
        ) : canVoteL1 ? (
          <VoteReview
            choice={currentChoice}
            startTimestamp={data?.proposal?.start}
            isSelected={primaryWallet?.id === ethWallet?.id}
            voteCount={votingPower as number}
            setWalletCallback={async () => {
              setIsWrongAccount(false);
              if (walletClient?.account?.address) {
                if (
                  walletClient?.account?.address?.toLowerCase() !==
                  ethWallet?.address?.toLowerCase()
                ) {
                  setIsWrongAccount(true);
                }
              }
              await setPrimaryWallet(ethWallet?.id);
            }}
          />
        ) : null}
        {hasVotedL2 ? (
          <PastVote
            isStarknet
            voteCount={votingPowerL2 as number}
            choice={voteL2.data.votes[0].choice}
          />
        ) : canVoteL2 ? (
          <VoteReview
            choice={currentChoice}
            isSelected={primaryWallet?.id === starknetWallet?.id}
            voteCount={votingPowerL2 as number}
            isStarknet
            setWalletCallback={async () => {
              setIsWrongAccount(false);
              if (
                getChecksumAddress(starknetWallet?.address) !==
                getChecksumAddress(activeStarknetWallet)
              ) {
                setIsWrongAccount(true);
              } else {
                await setPrimaryWallet(starknetWallet?.id);
              }
            }}
          />
        ) : null}
        <FormControl id="comment" mt="standard.xl">
          <FormLabel fontSize="14px" color={"content.default.default"}>
            Reason{" "}
            <Text color="content.support.default" as="span">
              (optional)
            </Text>
          </FormLabel>
          <Textarea
            variant="primary"
            name="comment"
            maxLength={140}
            placeholder="Type your message..."
            rows={4}
            focusBorderColor={"#292932"}
            resize="none"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </FormControl>
        <Modal.Footer>
          <Button
            type="submit"
            variant="primary"
            size="standard"
            disabled={
              primaryWallet?.address === ethWallet?.address &&
              data.proposal.start + 900 - Math.floor(Date.now() / 1000) > 0
            }
            onClick={() => handleVote(currentChoice, comment)}
          >
            Submit vote
          </Button>
        </Modal.Footer>
      </Modal>
      <StatusModal
        isOpen={isStatusModalOpen}
        isSuccess={!statusDescription?.length}
        isFail={!!statusDescription?.length}
        onClose={() => {
          setIsStatusModalOpen(false);
        }}
        title={statusTitle}
        description={statusDescription}
      />
      <InfoModal
        title="Connect wallet to cast a vote"
        isOpen={isConnectedModal}
        onClose={() => setIsConnectedModal(false)}
      >
        <WalletIcon />
        <Button variant="primary" onClick={() => setShowAuthFlow(true)}>
          Connect your wallet
        </Button>
      </InfoModal>
      <InfoModal
        title="Snapshot info"
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        size="standard"
      >
        <SummaryItems.Root>
          <SummaryItems.Item
            label="Strategies"
            value={parsedVotingStrategies}
          />
          <SummaryItems.LinkItem
            label="IPFS #"
            link={`https://snapshot.4everland.link/ipfs//${data?.proposal?.ipfs}`}
            linkLabel={data?.proposal?.ipfs?.slice(0, 7) || ""}
            isExternal={true}
          />
          <SummaryItems.Item label="Voting system" value={"Basic Voting"} />
          <SummaryItems.CustomDate
            label="Start date"
            value={data?.proposal?.start || null}
          />
          <SummaryItems.CustomDate
            label="End date"
            value={data?.proposal?.end || null}
          />

          <SummaryItems.LinkItem
            label="Txn hash"
            link={`https://starkscan.co/tx/${data?.proposal?.tx}`}
            linkLabel={truncateAddress(data?.proposal?.tx || "")}
            isExternal={true}
          />
        </SummaryItems.Root>
        <Button
          size="standard"
          variant="primary"
          onClick={() => setIsInfoOpen(false)}
        >
          Close
        </Button>
      </InfoModal>
      <ConfirmModal
        isOpen={isConfirmOpen}
        isStarknet={primaryWallet?.id === starknetWallet?.id}
        onClose={() => setisConfirmOpen(false)}
      />
      <InfoModal
        title="Vote submitted successfully"
        isOpen={isSuccessModalOpen}
        onClose={() => setisSuccessModalOpen(false)}
      >
        <Flex alignItems="center" justifyContent="center">
          <SuccessIcon boxSize="104px" />
        </Flex>

        <Button variant="primary" onClick={() => setisSuccessModalOpen(false)}>
          Close
        </Button>
      </InfoModal>

      <VoteLayout.Root>
        <VoteLayout.LeftSide>
          <VoteLayout.Content>
            <Flex
              gap="0"
              direction={{ base: "column" }}
              color="content.default.default"
            >
              <Box mb="standard.2xl" display={{ lg: "none" }}>
                <BackButton
                  buttonText="Voting proposals"
                  urlStart={["/voting-proposals/"]}
                  href="/voting-proposals"
                  pageContext={pageContext}
                />
              </Box>
              <Flex alignItems="center" width="100%">
                <Flex flex="1">
                  <Heading
                    color="content.accent.default"
                    variant="h2"
                    mb="standard.md"
                  >
                    {data?.proposal?.title}
                  </Heading>
                </Flex>

                <Box marginLeft="auto">
                  <MoreActions>
                    {!user?.isAuthenticatedWithAWallet ? (
                      <ChakraButton
                        variant="ghost"
                        width={"100%"}
                        justifyContent={"flex-start"}
                        padding={0}
                        minHeight={"33px"}
                        paddingLeft={"10px"}
                        fontWeight={"400"}
                        textColor={"#1a1523"}
                        onClick={() => setHelpMessage("connectWalletMessage")}
                      >
                        Report
                      </ChakraButton>
                    ) : (
                      <ChakraButton
                        variant="ghost"
                        data-tally-open="mKx1xD"
                        data-tally-emoji-text="👋"
                        data-tally-emoji-animation="wave"
                        data-proposal={
                          typeof window !== "undefined"
                            ? window.location.href
                            : ""
                        }
                        width={"100%"}
                        justifyContent={"flex-start"}
                        padding={0}
                        minHeight={"33px"}
                        paddingLeft={"10px"}
                        fontWeight={"400"}
                        textColor={"#1a1523"}
                      >
                        Report
                      </ChakraButton>
                    )}
                  </MoreActions>
                </Box>
              </Flex>
              <Flex
                gap="standard.sm"
                flexWrap={"wrap"}
                rowGap="standard.sm"
                mb="standard.md"
              >
                <Flex gap="standard.sm" paddingTop="0" alignItems="center">
                  <Stat.Root>
                    <Stat.Status status={data?.proposal?.state} />
                  </Stat.Root>
                  <Text variant="small" color="content.default.default">
                    •
                  </Text>
                  {/* toDo get user images / display names */}
                  <Username
                    withCopy
                    src={authorInfo?.profileImage || null}
                    displayName={
                      authorInfo?.username ||
                      authorInfo?.ensName ||
                      truncateAddress(`${data?.proposal?.author}`)
                    }
                    address={`${data?.proposal?.author}`}
                    showTooltip={!authorInfo?.username || !authorInfo?.ensName}
                    tooltipContent={`${data?.proposal?.author}`}
                  />
                </Flex>
                <Flex gap="standard.xs" paddingTop="0" alignItems="center">
                  <Text
                    display={{ base: "none", md: "inline-block" }}
                    variant="small"
                    color="content.default.default"
                  >
                    •
                  </Text>
                  <Stat.Root>
                    <Stat.Date
                      date={
                        data?.proposal?.start
                          ? new Date(data?.proposal?.start * 1000)
                          : undefined
                      }
                    />
                  </Stat.Root>
                  <Text variant="small" color="content.default.default">
                    •
                  </Text>
                  <Stat.Root>
                    <Stat.Link
                      href="#discussion"
                      label={`${commentCountData || 0} comments`}
                    />
                  </Stat.Root>
                  {/* <Text variant="small" color="content.default.default">
                    •
                  </Text>
                  <Stat.Root>
                    <Stat.Text label={`Category`} />
                  </Stat.Root> */}
                </Flex>
              </Flex>
              <Box>
                <Link
                  as="button"
                  size="small"
                  onClick={() => setIsInfoOpen(true)}
                >
                  View Snapshot info
                </Link>
              </Box>
              {data?.proposal?.discussion &&
              data?.proposal?.discussion.length ? (
                <Box
                  height="110px!important"
                  overflow="hidden"
                  mt="standard.2xl"
                >
                  <Iframely
                    id={import.meta.env.VITE_APP_IFRAMELY_ID}
                    url={`${data?.proposal?.discussion}`}
                  />
                </Box>
              ) : (
                <></>
              )}

              <Box mt="standard.2xl">
                <MarkdownRenderer content={data?.proposal?.body || ""} />
              </Box>
              <Divider my="standard.2xl" />
            </Flex>
          </VoteLayout.Content>
          <VotingProposalComments
            proposalId={pageContext.routeParams!.id}
            proposalState={data?.proposal?.state}
          />
        </VoteLayout.LeftSide>
        <VoteLayout.RightSide>
          <VoteLayout.VoteWidget>
            {data?.proposal?.state === "active" ||
            data?.proposal?.state === "closed" ? (
              <>
                {!user && data?.proposal?.state === "active" && (
                  <Heading
                    color="content.accent.default"
                    variant="h4"
                    mb="standard.md"
                  >
                    Cast your vote
                  </Heading>
                )}
                {(!hasVotedL1 && canVoteL1) || (!hasVotedL2 && canVoteL2) ? (
                  <Heading
                    color="content.accent.default"
                    variant="h4"
                    mb="standard.md"
                  >
                    Cast your vote
                  </Heading>
                ) : null}
                {votingPower === 0 &&
                  votingPowerL2 === 0 &&
                  user &&
                  data?.proposal?.state !== "closed" &&
                  !votingPowerLoading &&
                  !votingPowerLoadingL2 &&
                  !hasVotedL2 &&
                  !hasVotedL1 &&
                  !shouldShowHasDelegated && (
                    <>
                      <Banner label="You cannot vote as it seems you didn’t have any voting power when this Snapshot was taken." />
                      <Divider mb="standard.2xl" />
                    </>
                  )}

                {(hasDelegatedOnL1 || hasDelegatedOnL2) &&
                  data?.proposal?.state !== "closed" && (
                    <>
                      <Banner label={renderBannerBasedOnDelegation()} />

                      <Divider mb="standard.2xl" />
                    </>
                  )}

                {vote.data && vote.data.votes?.[0] && (
                  <>
                    <Banner
                      label={`You voted ${
                        vote.data.votes[0].choice === 1
                          ? data?.proposal?.choices?.[0] || "For"
                          : vote.data.votes[0].choice === 2
                          ? data?.proposal?.choices?.[1] || "Against"
                          : data?.proposal?.choices?.[2] || "Abstain"
                      } using ${vote.data.votes[0].vp} votes on Ethereum (L1)`}
                    />
                    <Divider mb="standard.2xl" />
                  </>
                )}
                {voteL2.data && voteL2.data.votes?.[0] && (
                  <>
                    <Banner
                      label={`You voted ${
                        voteL2.data.votes[0].choice === 1
                          ? data?.proposal?.choices?.[0] || "For"
                          : voteL2.data.votes[0].choice === 2
                          ? data?.proposal?.choices?.[1] || "Against"
                          : data?.proposal?.choices?.[2] || "Abstain"
                      } using ${
                        voteL2.data.votes[0].vp
                      } votes on Starknet (L2)`}
                    />
                    <Divider mb="standard.2xl" />
                  </>
                )}
                {(canVoteL2 || canVoteL1) &&
                user &&
                data?.proposal?.state !== "closed" ? (
                  <Flex
                    mb="40px"
                    gap="standard.sm"
                    display="flex"
                    flexDirection={{ base: "column", xl: "row" }}
                    justifyContent="space-around"
                  >
                    {data.proposal?.choices.map((choice, index) => (
                      <VoteButton
                        key={choice}
                        onClick={async () => {
                          setcurrentChoice(index + 1);
                          if (
                            hasVotedL1 &&
                            starknetWallet?.id &&
                            primaryWallet?.id !== starknetWallet?.id
                          ) {
                            await setPrimaryWallet(starknetWallet?.id);
                          }
                          if (
                            hasVotedL2 &&
                            ethWallet?.id &&
                            primaryWallet?.id !== ethWallet?.id
                          ) {
                            await setPrimaryWallet(ethWallet?.id);
                          }
                          setIsOpen(true);
                        }}
                        active={vote?.data?.votes?.[0]?.choice === index + 1}
                        // @ts-expect-error todo
                        type={choice}
                        label={`${choice}`}
                      />
                    ))}
                  </Flex>
                ) : !user && data?.proposal?.state !== "closed" ? (
                  <Flex
                    mb="40px"
                    gap="standard.sm"
                    display="flex"
                    flexDirection={{ base: "column", xl: "row" }}
                    justifyContent="space-around"
                  >
                    {data.proposal?.choices.map((choice) => (
                      <VoteButton
                        key={choice}
                        onClick={() => {
                          setHelpMessage("connectWalletMessage");
                        }}
                        // @ts-expect-error todo
                        type={choice}
                        label={`${choice}`}
                      />
                    ))}
                  </Flex>
                ) : null}

                <Box>
                  <Heading
                    color="content.accent.default"
                    variant="h4"
                    mb="standard.md"
                  >
                    {data?.proposal?.state === "active"
                      ? `Current results`
                      : "Final Results"}
                  </Heading>
                  {data?.proposal?.choices.map((choice, index) => {
                    const totalVotes = data?.proposal?.scores_total;
                    const voteCount = data?.proposal?.scores![index];
                    const userVote = false;
                    const strategies = data?.proposal?.strategies;
                    {
                      /*console.log(data?.proposal) */
                    }
                    return (
                      <VoteStat
                        key={choice}
                        choice={index}
                        type={choice}
                        totalVotes={totalVotes}
                        voteCount={voteCount}
                        userVote={userVote}
                        strategies={strategies}
                        delegationSymbol={
                          import.meta.env.VITE_APP_DELEGATION_SYMBOL
                        }
                      />
                    );
                  })}
                </Box>
                <Box mt={4}>
                  <SimpleGrid columns={2}>
                    <Box>
                      <Heading
                        lineHeight={{
                          base: "1.5rem",
                          md: "2rem",
                        }}
                        variant={"h3"}
                        fontSize={{
                          base: "16px",
                          md: "21px",
                        }}
                      >
                        {formatPercentageForVotingPower()}
                      </Heading>
                      <Text
                        display="flex"
                        gap={"4px"}
                        variant="bodySmallMedium"
                        color="content.default.default"
                      >
                        % of total voting power
                      </Text>
                    </Box>
                    <Box>
                      <Heading
                        lineHeight={{
                          base: "1.5rem",
                          md: "2rem",
                        }}
                        variant={"h3"}
                        fontSize={{
                          base: "16px",
                          md: "21px",
                        }}
                      >
                        {formatPercentageForVotes()}
                      </Heading>
                      <Text
                        display="flex"
                        gap={"4px"}
                        variant="bodySmallMedium"
                        color="content.default.default"
                      >
                        % of total voters
                      </Text>
                    </Box>
                  </SimpleGrid>
                </Box>
                <Divider
                  mb="standard.2xl"
                  mt="standard.2xl"
                  position="relative"
                  left={{ base: "-16px", xl: "-24px" }}
                  width={{ base: "calc(100% + 32px)", xl: "calc(100% + 48px)" }}
                />
                <Box mb="standard.2xl">
                  <Heading
                    variant="h4"
                    mb={pastVotes?.length > 0 ? "standard.sm" : "0px"}
                  >
                    Votes
                  </Heading>
                  {showPastVotes ? (
                    pastVotesWithUserInfo.map((vote, index) => (
                      <VoteComment
                        key={index}
                        author={
                          vote?.author?.username ||
                          vote?.author?.ensName ||
                          null
                        }
                        address={vote?.voter as string}
                        voted={
                          vote?.choice === 1
                            ? "For"
                            : vote?.choice === 2
                            ? "Against"
                            : "Abstain"
                        }
                        comment={vote?.body as string}
                        voteCount={vote?.vp as number}
                        signature={vote?.ipfs as string}
                        tx={vote?.tx as string}
                      />
                    ))
                  ) : (
                    <EmptyState
                      title={`No votes ${
                        data?.proposal?.state !== "closed" ? "yet" : ""
                      }`}
                      type="votesCast"
                      border={false}
                    />
                  )}
                </Box>
              </>
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                gap="16px"
                height="100%"
                // height={data?.proposal?.state === "pending" ? "100vh" : "100%"}

                position="relative"
              >
                <Flex
                  direction="column"
                  height={{ base: "auto", lg: "800px" }}
                  alignItems="center"
                  justifyContent="center"
                  position={{ base: "unset", lg: "sticky" }}
                  top="0"
                >
                  <PlaceholderImage />
                  <Heading
                    variant="h4"
                    color="content.default.default"
                    mb="8px"
                  >
                    Voting starts{" "}
                    {`${formatDate(
                      data?.proposal?.start ?? 0,
                      "yyyy-MM-dd",
                      true,
                    )}`}
                  </Heading>
                  <Text
                    textAlign="center"
                    variant="small"
                    color="content.default.default"
                  >
                    Review the proposal, discuss and debate before voting
                    starts.
                  </Text>
                </Flex>
              </Box>
            )}
          </VoteLayout.VoteWidget>
        </VoteLayout.RightSide>
      </VoteLayout.Root>
      <WrongAccountOrNetworkModal
        isOpen={isWrongAccount}
        onClose={() => setIsWrongAccount(false)}
        expectedStarknetAddress={starknetWallet?.address}
        starknetAddress={activeStarknetWallet}
        ethAddress={walletClient?.account?.address}
        expectedEthAddress={ethWallet?.address}
      />
    </>
  );
}

export const documentProps = {
  title: "Proposals / Voting",
  image: "/social/social-proposal.png",
} satisfies DocumentProps;
