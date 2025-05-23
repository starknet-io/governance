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
import { Button as ChakraButton, Select } from "@chakra-ui/react";
import { BackButton } from "src/components/Header/BackButton";
import { useHelpMessage } from "src/hooks/HelpMessage";
import VotingProposalComments from "../../components/VotingProposals/VotingProposalComments/VotingProposalComments";
import { useOldProposal } from "../../hooks/snapshotX/useOldProposal";
import { useVotingPower } from "../../hooks/snapshotX/useVotingPower";
import { useL1StarknetDelegationDelegates } from "../../wagmi/L1StarknetDelegation";
import { useWallets } from "../../hooks/useWallets";
import { useStarknetBalance } from "../../hooks/starknet/useStarknetBalance";
import { useOldVotes } from "../../hooks/snapshotX/useOldVotes";

export function Page() {
  const pageContext = usePageContext();
  const { data: walletClient } = useWalletClient();
  const [helpMessage, setHelpMessage] = useHelpMessage();
  const { ethWallet, starknetWallet } = useWallets();

  const { data, refetch } = useOldProposal({
    proposal: pageContext.routeParams!.id,
  });

  const { data: votingPower, isLoading: votingPowerLoading } = useVotingPower({
    address: ethWallet?.address as string,
    proposal: data?.proposal?.id,
  });

  const vote = useOldVotes({
    proposal: pageContext.routeParams!.id.toString(),
    voter: ethWallet?.address,
    skipField: "voter",
  });

  /*
  TODO: revert real votes from SX when time
  const votes = useVotes({
    proposal: pageContext.routeParams!.id,
    skipField: "proposal",
  });
  console.log(votes);
   */

  console.log(vote);

  const votes = trpc.votes.getOldVotesForProposal.useQuery({
    proposalId: pageContext.routeParams!.id,
  });

  console.log(votes?.data);

  const address = walletClient?.account.address as `0x${string}` | undefined;

  const delegation = useL1StarknetDelegationDelegates({
    address: import.meta.env.VITE_APP_STARKNET_REGISTRY,
    args: [address!],
    watch: true,
    enabled: address != null,
  });

  const delegationDataL1 = delegation?.data;

  const userBalance = useBalanceData(address);
  const starknetBalance = useStarknetBalance({
    starknetAddress: starknetWallet?.address,
  });

  const { data: commentCountData } =
    trpc.proposals.getProposalCommentCount.useQuery({
      id: pageContext.routeParams!.id,
    });

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
  const hasVoted = vote.data && vote.data.votes?.[0];
  const delegateOwnProfileL1 =
    delegationDataL1?.toLowerCase() === ethWallet?.address?.toLowerCase();
  const hasDelegatedOnL1 =
    delegationDataL1 &&
    delegationDataL1.length &&
    delegationDataL1 !== "0x0000000000000000000000000000000000000000" &&
    !delegateOwnProfileL1;
  const hasVotedL1 = vote.data && vote.data.votes?.[0];

  const hasDelegated = false;
  const shouldShowHasDelegated = hasDelegated && !hasVoted && !canVote;
  const showPastVotes = votes?.data && votes?.data?.length > 0;
  const pastVotes = votes?.data || [];
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

  const renderBannerBasedOnDelegation = () => {
    if (hasDelegatedOnL1) {
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
    } else {
      return <></>;
    }
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
          <Button type="submit" variant="primary" size="standard">
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
          <SummaryItems.StrategySummary
            strategies={
              (data?.proposal?.strategies || []).filter((s) => s) as any[]
            }
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
            label="Snapshot block #"
            link={`https://etherscan.io/block/${data?.proposal?.snapshot}`}
            linkLabel={
              data?.proposal?.snapshot
                ? parseInt(data.proposal.snapshot, 10).toLocaleString()
                : ""
            }
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
                {hasDelegatedOnL1 && data?.proposal?.state !== "closed" && (
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
                    const totalVotes = data?.proposal?.scores?.reduce(
                      (a, b) => a! + b!,
                      0,
                    );
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
                    mb={
                      votes.data && votes.data.length > 0
                        ? "standard.sm"
                        : "0px"
                    }
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
                          vote?.votePreference === 1
                            ? "For"
                            : vote?.votePreference === 2
                            ? "Against"
                            : "Abstain"
                        }
                        comment={vote?.body as string}
                        voteCount={vote?.voteCount as number}
                        signature={vote?.ipfs as string}
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
    </>
  );
}

export const documentProps = {
  title: "ProposalsOld / Voting",
  image: "/social/social-proposal.png",
} satisfies DocumentProps;
