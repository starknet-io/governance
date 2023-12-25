import { DocumentProps } from "src/renderer/types";
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  CommentInput,
  CommentList,
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
} from "@yukilabs/governance-components";
import * as VoteLayout from "../../components/VotingProposals/VotingProposal/PageLayout";
import { gql } from "src/gql";
import { useQuery } from "@apollo/client";
import { usePageContext } from "src/renderer/PageContextProvider";
import { formatDate } from "@yukilabs/governance-components/src/utils/helpers";
import { useWalletClient } from "wagmi";
import snapshot from "@snapshot-labs/snapshot.js";
import { providers } from "ethers";
import { Vote } from "@snapshot-labs/snapshot.js/dist/sign/types";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { trpc } from "src/utils/trpc";
import { useDelegateRegistryDelegation } from "src/wagmi/DelegateRegistry";
import { useBalanceData } from "src/utils/hooks";
import { truncateAddress } from "@yukilabs/governance-components/src/utils";
import { stringToHex } from "viem";
import { MINIMUM_TOKENS_FOR_DELEGATION } from "../delegates/profile/@id.page";
import {
  SuccessIcon,
  WalletIcon,
} from "@yukilabs/governance-components/src/Icons";
import { Button as ChakraButton, Select } from "@chakra-ui/react";
import { BackButton } from "src/components/Header/BackButton";
import { useHelpMessage } from "src/hooks/HelpMessage";

const sortByOptions = {
  defaultValue: "date",
  options: [
    { label: "Date", value: "date" },
    { label: "Upvotes", value: "upvotes" },
  ],
};

export function Page() {
  const pageContext = usePageContext();
  const { data: walletClient } = useWalletClient();
  const [helpMessage, setHelpMessage] = useHelpMessage();

  const { data, refetch } = useQuery(
    gql(`query Proposal($proposal: String) {
      proposal(id: $proposal) {
      id
      author
      title
      body
      choices
      votes
      scores
      start
      end
      state
      discussion
      ipfs
      type
      scores_by_strategy
      scores_state
      scores_total
      scores_updated
      snapshot
        strategies {
          network
          params
        }
      }

    }`),
    {
      variables: {
        proposal: pageContext.routeParams!.id,
      },
    },
  );
  const {
    data: vp,
    loading: isVotingPowerLoading,
    refetch: refetchVotingProposal,
  } = useQuery(
    gql(`query VpProposal($voter: String!, $space: String!, $proposal: String) {
      vp(voter: $voter, space: $space, proposal: $proposal) {
        vp
        vp_by_strategy
        vp_state
      }
    }`),
    {
      variables: {
        proposal: pageContext.routeParams!.id,
        space: import.meta.env.VITE_APP_SNAPSHOT_SPACE,
        voter: walletClient?.account.address as any,
      },
      skip: walletClient?.account.address == null,
    },
  );

  const vote = useQuery(
    gql(`
      query Vote($where: VoteWhere) {
        votes(where: $where) {
          choice
          voter
          reason
          metadata
          created
          ipfs
          vp
          vp_by_strategy
          vp_state
        }
      }
    `),
    {
      variables: {
        where: {
          voter: walletClient?.account.address as any,
          proposal: pageContext.routeParams!.id,
        },
      },
      skip: walletClient?.account.address == null,
    },
  );

  const votes = useQuery(
    gql(`
      query VotingProposalsVotes($where: VoteWhere) {
        votes(where: $where) {
          choice
          voter
          reason
          metadata
          created
          ipfs
          vp
          vp_by_strategy
          vp_state
        }
      }
    `),
    {
      variables: {
        where: {
          proposal: pageContext.routeParams!.id,
        },
      },
    },
  );

  const address = walletClient?.account.address as `0x${string}` | undefined;

  const delegation = useDelegateRegistryDelegation({
    address: import.meta.env.VITE_APP_DELEGATION_REGISTRY,
    args: [
      address!,
      stringToHex(import.meta.env.VITE_APP_SNAPSHOT_SPACE, { size: 32 }),
    ],
    watch: true,
    chainId: parseInt(import.meta.env.VITE_APP_DELEGATION_CHAIN_ID),
    enabled: address != null,
  });

  const userBalance = useBalanceData(address);

  async function handleVote(choice: number, reason?: string) {
    try {
      if (walletClient == null) return;

      if ((vp?.vp?.vp || 0) < MINIMUM_TOKENS_FOR_DELEGATION) {
        setIsStatusModalOpen(true);
        setStatusTitle("No voting power");
        setStatusDescription(
          `You do not have enough tokens in your account to vote. You need at least ${MINIMUM_TOKENS_FOR_DELEGATION} tokens to vote.`,
        );
        setIsOpen(false);
        return;
      }

      const client = new snapshot.Client712(
        import.meta.env.VITE_APP_SNAPSHOT_URL,
      );

      const params: Vote = {
        // from?: string;
        space: import.meta.env.VITE_APP_SNAPSHOT_SPACE,
        // timestamp?: number;
        proposal: pageContext.routeParams!.id,
        type: "basic",
        choice,
        // privacy?: string;
        reason,
        // app?: string;
        // metadata?: string;
      };
      setIsOpen(false);
      setisConfirmOpen(true);

      const web3 = new providers.Web3Provider(walletClient.transport);

      const deeplink = walletConnector?.getDeepLink();
      if (deeplink) {
        window.location.href = deeplink;
      }

      const receipt = (await client.vote(
        web3,
        walletClient.account.address,
        params,
      )) as any;
      setisConfirmOpen(false);
      setisSuccessModalOpen(true);
      refetch();
      vote.refetch();
      votes.refetch();
    } catch (error: any) {
      // Handle error
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
  const [sortBy, setSortBy] = useState<"date" | "upvotes">("date");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
  const [statusTitle, setStatusTitle] = useState<string>("");
  const [statusDescription, setStatusDescription] = useState<string>("");
  const [isConnectedModal, setIsConnectedModal] = useState<boolean>(false);
  const [allComments, setAllComments] = useState([])
  const { user, setShowAuthFlow, walletConnector } = useDynamicContext();
  const [commentError, setCommentError] = useState("");
  const hasVoted = vote.data && vote.data.votes?.[0];
  const canVote =
    data?.proposal?.state === "active" && vp?.vp?.vp && vp?.vp?.vp !== 0;
  const hasDelegated =
    delegation.isFetched &&
    userBalance.isFetched &&
    delegation.data &&
    delegation.data != "0x0000000000000000000000000000000000000000";
  const shouldShowHasDelegated = hasDelegated && !hasVoted && !canVote;

  const showPastVotes = votes?.data?.votes && votes?.data?.votes.length > 0;
  const pastVotes = votes?.data?.votes || [];
  const userAddresses =
    pastVotes.map((pastVote) => pastVote?.voter?.toLowerCase() || "") || [];
  const { data: authorInfo } = trpc.users.getUser.useQuery({
    address: data?.proposal?.author || "",
  });
  const { data: usersByAddresses } =
    trpc.users.getUsersInfoByAddresses.useQuery({
      addresses: userAddresses || [],
    });
  const pastVotesWithUserInfo = pastVotes.map((pastVote) => {
    return {
      ...pastVote,
      author:
        pastVote?.voter && usersByAddresses?.[pastVote.voter.toLowerCase()]
          ? usersByAddresses[pastVote.voter.toLowerCase()]
          : {},
    };
  });
  const [commentsState, setCommentsState] = useState({
    proposalId: data?.proposal?.id ?? "",
    sort: sortBy,
    limit: 5,
    offset: 1,
  });
  const comments = trpc.comments.getProposalComments.useQuery({
    ...commentsState,
  });
  const commentCount = comments?.data?.comments?.length || 0;

  useEffect(() => {
    comments.refetch();
  }, [user?.isAuthenticatedWithAWallet]);

  useEffect(() => {
    if (comments.data && comments.data?.comments && !comments.isLoading) {
      setAllComments((prevComments) => [...prevComments, ...comments.data?.comments]);
    }
  }, [comments.data, comments.isLoading]);

  useEffect(() => {
    if (user) {
      setIsConnectedModal(false);
    }
  }, [user]);

  const onLoadMoreComments = () => {
    setCommentsState({
      ...commentsState,
      offset: commentsState.offset + 1,
    });
  };

  const saveComment = trpc.comments.saveComment.useMutation({
    onSuccess: () => {
      comments.refetch();
    },
  });

  const editComment = trpc.comments.editComment.useMutation({
    onSuccess: () => {
      comments.refetch();
    },
  });

  const deleteComment = trpc.comments.deleteComment.useMutation({
    onSuccess: () => {
      comments.refetch();
    },
  });

  const voteComment = trpc.comments.voteComment.useMutation({
    onSuccess: () => {
      comments.refetch();
    },
  });

  const handleCommentSend = async (value: string) => {
    try {
      await saveComment.mutateAsync({
        content: value,
        proposalId: data?.proposal?.id,
      });
    } catch (error) {
      // Handle error
      throw error;
    }
  };

  const handleCommentEdit = async ({
    content,
    commentId,
  }: {
    content: string;
    commentId: number;
  }) => {
    try {
      await editComment.mutateAsync({
        content,
        id: commentId,
      });
    } catch (error) {
      // Handle error
      throw error;
    }
  };

  const handleCommentDelete = async ({ commentId }: { commentId: number }) => {
    try {
      await deleteComment.mutateAsync({
        id: commentId,
      });
    } catch (error) {
      // Handle error
      console.log(error);
    }
  };

  const handleReplySend = async ({
    content,
    parentId,
  }: {
    content: string;
    parentId: number;
  }) => {
    try {
      await saveComment.mutateAsync({
        content,
        parentId,
        proposalId: data?.proposal?.id,
      });
    } catch (error) {
      // Handle error
      throw error;
    }
  };

  const handleCommentVote = async ({
    commentId,
    voteType,
  }: {
    commentId: number;
    voteType: "upvote" | "downvote";
  }) => {
    try {
      await voteComment.mutateAsync({
        commentId,
        voteType,
      });
    } catch (error) {
      // Handle error
      console.log(error);
    }
  };

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
    address: delegation?.data ? delegation?.data?.toLowerCase() : "",
  });

  if (data == null) return null;

  return (
    <>
      <Modal
        title="Confirm Vote"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="md"
      >
        <VoteReview choice={currentChoice} voteCount={vp?.vp?.vp as number} />
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
          <SummaryItems.Item
            label="Voting system"
            value={`${data?.proposal?.type} voting`}
          />
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
                  href="/voting-proposals "
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
                      label={`${commentCount} comments`}
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

              {data?.proposal?.discussion !== "" ? (
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
          <VoteLayout.Discussion>
            <Heading
              color="content.accent.default"
              variant="h3"
              mb="standard.2xl"
              id="discussion"
            >
              Discussion
            </Heading>
            {user ? (
              <FormControl id="delegate-statement">
                <CommentInput
                  onSend={async (comment) => {
                    try {
                      await handleCommentSend(comment);
                      setCommentError("");
                    } catch (err) {
                      setCommentError(err?.message || "");
                    }
                  }}
                />
                {commentError && commentError.length && (
                  <Box mb={6}>
                    <Banner type="error" variant="error" label={commentError} />
                  </Box>
                )}
              </FormControl>
            ) : (
              <Box>
                <FormControl>
                  <Box onClick={() => setHelpMessage("connectWalletMessage")}>
                    <CommentInput
                      onSend={async (comment) => {
                        console.log(comment);
                      }}
                    />
                  </Box>
                </FormControl>
              </Box>
            )}
            {allComments.length > 0 ? (
              <>
                <AppBar.Root>
                  <AppBar.Group mobileDirection="row" gap="standard.sm">
                    <Box minWidth={"52px"}>
                      <Text variant="mediumStrong">Sort by</Text>
                    </Box>
                    <Select
                      size="sm"
                      aria-label="Sort by"
                      focusBorderColor={"red"}
                      rounded="md"
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(e.target.value as "upvotes" | "date")
                      }
                    >
                      <option selected hidden disabled value="">
                        Sort by
                      </option>
                      {sortByOptions.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </AppBar.Group>
                </AppBar.Root>
                <Box mt="standard.xs">
                  <CommentList
                    commentsList={allComments || []}
                    onVote={handleCommentVote}
                    onDelete={handleCommentDelete}
                    onReply={handleReplySend}
                    onEdit={handleCommentEdit}
                  />
                </Box>
              </>
            ) : (
              <EmptyState
                hasBorder={false}
                type="comments"
                title="Add the first comment"
              />
            )}
            {/*
            <Banner label="Comments are now closed." />
            */}
            {comments?.data?.moreCommentsAvailable && (
              <>
                <Button variant="ghost" onClick={onLoadMoreComments}>
                  View More Comments
                </Button>
              </>
            )}
          </VoteLayout.Discussion>
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
                {!hasVoted && canVote ? (
                  <Heading
                    color="content.accent.default"
                    variant="h4"
                    mb="standard.md"
                  >
                    Cast your vote
                  </Heading>
                ) : null}
                {vp?.vp?.vp === 0 &&
                  user &&
                  data?.proposal?.state !== "closed" &&
                  !isVotingPowerLoading &&
                  !shouldShowHasDelegated && (
                    <>
                      <Banner label="You cannot vote as it seems you didn’t have any voting power when this Snapshot was taken." />
                      <Divider mb="standard.2xl" />
                    </>
                  )}

                {shouldShowHasDelegated &&
                  data?.proposal?.state !== "closed" && (
                    <>
                      <Heading
                        color="content.accent.default"
                        variant="h4"
                        mb="standard.md"
                      >
                        Your vote
                      </Heading>
                      <Banner
                        label={
                          <>
                            Your voting power of {userBalance.balance}{" "}
                            {userBalance.symbol} is currently assigned to
                            delegate{" "}
                            <Link
                              fontSize="small"
                              fontWeight="normal"
                              href={`/delegates/profile/${delegatedTo?.data?.delegationStatement?.id}`}
                            >
                              {truncateAddress(delegation.data! || "")}
                            </Link>
                          </>
                        }
                      />

                      <Divider mb="standard.2xl" />
                    </>
                  )}

                {vote.data && vote.data.votes?.[0] && (
                  <>
                    <Heading
                      color="content.accent.default"
                      variant="h4"
                      mb="standard.md"
                    >
                      Your vote
                    </Heading>
                    <Banner
                      label={`You voted ${
                        vote.data.votes[0].choice === 1
                          ? "For"
                          : vote.data.votes[0].choice === 2
                          ? "Against"
                          : "Abstain"
                      } using ${vote.data.votes[0].vp} votes`}
                    />
                    <Divider mb="standard.2xl" />
                  </>
                )}
                {(hasVoted || (canVote && user)) &&
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
                        onClick={() => {
                          setcurrentChoice(index + 1);
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
                    const totalVotes = data?.proposal?.scores?.reduce(
                      (a, b) => a! + b!,
                      0,
                    );
                    const voteCount = data?.proposal?.scores![index];
                    const userVote = false;
                    const strategies = data?.proposal?.strategies;
                    const scoresByStrategy =
                      data?.proposal?.scores_by_strategy[index];
                    return (
                      <VoteStat
                        key={choice}
                        // @ts-expect-error todo
                        type={choice}
                        // @ts-expect-error todo
                        totalVotes={totalVotes}
                        // @ts-expect-error todo
                        voteCount={voteCount}
                        userVote={userVote}
                        // @ts-expect-error todo
                        strategies={strategies}
                        scoresByStrategy={scoresByStrategy}
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
                      votes.data?.votes && votes.data.votes.length > 0
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
                          vote?.choice === 1
                            ? "For"
                            : vote?.choice === 2
                            ? "Against"
                            : "Abstain"
                        }
                        comment={vote?.reason as string}
                        voteCount={vote?.vp as number}
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
  title: "Proposals / Voting",
  image: "/social/social-proposal.png",
} satisfies DocumentProps;
