import { DocumentProps } from "src/renderer/types";
import { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  CommentInput,
  CommentList,
  ConfirmModal,
  ContentContainer,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  InfoModal,
  PlaceholderImage,
  Stack,
  Stat,
  SummaryItems,
  Text,
  Textarea,
  VoteButton,
  VoteModal,
  VoteReview,
  VoteStat,
  StatusModal,
  Iframely,
  VoteComment,
  MarkdownRenderer,
  Select,
  Banner,
  EllipsisIcon,
} from "@yukilabs/governance-components";
import { gql } from "src/gql";
import { useQuery } from "@apollo/client";
import { usePageContext } from "src/renderer/PageContextProvider";
import { formatDate } from "@yukilabs/governance-components/src/utils/helpers";
import { useWalletClient } from "wagmi";
import snapshot from "@snapshot-labs/snapshot.js";
import { providers } from "ethers";
import { Vote } from "@snapshot-labs/snapshot.js/dist/sign/types";
import { useDynamicContext } from "@dynamic-labs/sdk-react";
import { trpc } from "src/utils/trpc";
import { useDelegateRegistryDelegation } from "src/wagmi/DelegateRegistry";
import { useBalanceData } from "src/utils/hooks";
import { truncateAddress } from "@yukilabs/governance-components/src/utils";
import { stringToHex } from "viem";
import { MINIMUM_TOKENS_FOR_DELEGATION } from "../delegates/profile/@id.page";

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
  const { data: vp } = useQuery(
    gql(`query Vp($voter: String!, $space: String!, $proposal: String) {
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

      console.log(data);

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
  const { user } = useDynamicContext();
  const hasVoted = vote.data && vote.data.votes?.[0];
  const canVote = data?.proposal?.state === "active";
  const hasDelegated =
    delegation.isFetched &&
    userBalance.isFetched &&
    delegation.data &&
    delegation.data != "0x0000000000000000000000000000000000000000";
  const comments = trpc.comments.getProposalComments.useQuery({
    proposalId: data?.proposal?.id ?? "",
    sort: sortBy,
  });
  const commentCount = comments?.data?.length || 0;

  useEffect(() => {
    comments.refetch();
  }, [user?.isAuthenticatedWithAWallet]);

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
      console.log(error);
    }
    console.log(value);
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
      console.log(error);
    }
    console.log(content);
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
    console.log("Deleted");
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
      console.log(error);
    }
    console.log(content);
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

  if (data == null) return null;
  return (
    <Box
      display="flex"
      flexDirection={{ base: "column", md: "column", lg: "row" }}
      flex="1"
      height="100%"
    >
      <VoteModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <VoteReview choice={currentChoice} voteCount={vp?.vp?.vp as number} />
        <FormControl id="comment">
          <FormLabel color={"#292932"}>Reason for vote (optional)</FormLabel>
          <Textarea
            variant="primary"
            name="comment"
            placeholder="I voted X because Y"
            rows={4}
            focusBorderColor={"#292932"}
            resize="none"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </FormControl>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          onClick={() => handleVote(currentChoice, comment)}
        >
          Submit vote
        </Button>
      </VoteModal>
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
        title="Snapshot info"
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      >
        <SummaryItems.Root>
          <SummaryItems.Item label="Stategies" value="Type" />
          <SummaryItems.Item
            isTruncated
            label="IPFS"
            value={data?.proposal?.ipfs}
          />
          <SummaryItems.Item
            label="Voting system"
            value={data?.proposal?.type}
          />
          {/* <SummaryItems.Date label="Start date" value={data.proposal?.start} />
          <SummaryItems.Date label="End date" value={data?.proposal?.end} /> */}
          <SummaryItems.Item
            label="Snapshot"
            value={data?.proposal?.snapshot}
          />
        </SummaryItems.Root>
        <Button variant="primary" onClick={() => setIsInfoOpen(false)}>
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
        Success!!
        <Button variant="primary" onClick={() => setisSuccessModalOpen(false)}>
          Close
        </Button>
      </InfoModal>
      <ContentContainer>
        <Box width="100%" maxWidth="710px" pb="200px" mx="auto">
          <Stack spacing="24px" direction={{ base: "column" }} color="#545464">
            <Box display="flex" alignItems="center">
              <Box flex="1">
                <Heading
                  color="#33333E"
                  variant="h3"
                  maxWidth="90%"
                  lineHeight="1.4em"
                >
                  {data?.proposal?.title}
                </Heading>
              </Box>
              <IconButton
                variant="simple"
                onClick={() => console.log("clicked")}
                aria-label="Search database"
                //toDo replace with ellipsis icon
                icon={<EllipsisIcon />}
              />
            </Box>
            <Flex gap="16px" paddingTop="0" alignItems="center">
              <Stat.Root>
                <Stat.Status status={data?.proposal?.state} />
              </Stat.Root>
              <Stat.Root>
                <Stat.Text label={`By ${data?.proposal?.author}`} />
              </Stat.Root>
              <Stat.Root>
                <Stat.Date
                  date={
                    data?.proposal?.start
                      ? new Date(data?.proposal?.start * 1000)
                      : undefined
                  }
                />
              </Stat.Root>
              <Stat.Root>
                <Stat.Link label={`${commentCount} comments`} />
              </Stat.Root>
              <Box ml="auto">
                <Stat.Root>
                  <Stat.Button
                    onClick={() => setIsInfoOpen(true)}
                    label={`View Snapshot info`}
                  />
                </Stat.Root>
              </Box>
            </Flex>
            <Divider />
            {data?.proposal?.discussion !== "" ? (
              <Iframely
                id={import.meta.env.VITE_APP_IFRAMELY_ID}
                url={`${data?.proposal?.discussion}`}
              />
            ) : (
              <></>
            )}
            <MarkdownRenderer content={data?.proposal?.body || ""} />

            <Divider my="32px" />
            <Heading color="#33333E" variant="h3">
              Discussion
            </Heading>
            {user ? (
              <FormControl id="delegate-statement">
                <CommentInput onSend={handleCommentSend} />
              </FormControl>
            ) : (
              <Box>Show logged out state for comment input</Box>
            )}
            <AppBar.Root>
              <AppBar.Group mobileDirection="row">
                <Box minWidth={"52px"}>
                  <Text variant="mediumStrong">Sort by</Text>
                </Box>
                <Select
                  size="sm"
                  aria-label="Sort by"
                  placeholder="Sort by"
                  focusBorderColor={"red"}
                  rounded="md"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "upvotes" | "date")
                  }
                >
                  {sortByOptions.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </AppBar.Group>
            </AppBar.Root>
            <CommentList
              commentsList={comments.data || []}
              onVote={handleCommentVote}
              onDelete={handleCommentDelete}
              onReply={handleReplySend}
              onEdit={handleCommentEdit}
            />
          </Stack>
        </Box>
      </ContentContainer>
      <Box
        pt="standard.3xl"
        px="standard.xl"
        borderLeft="1px solid"
        borderColor="border.forms"
        display="flex"
        flexDirection="column"
        flexBasis={{ base: "100%", md: "380px" }}
        height="100vh"
        top="0"
        position={{ base: "unset", lg: "sticky" }}
      >
        {data?.proposal?.state === "active" ||
        data?.proposal?.state === "closed" ? (
          <>
            {!hasVoted && canVote && !hasDelegated && (
              <Heading
                color="content.accent.default"
                variant="h4"
                mb="standard.md"
              >
                Cast your vote
              </Heading>
            )}

            {delegation.isFetched &&
              userBalance.isFetched &&
              delegation.data &&
              delegation.data !=
                "0x0000000000000000000000000000000000000000" && (
                <>
                  <Heading
                    color="content.accent.default"
                    variant="h4"
                    mb="standard.md"
                  >
                    Your vote
                  </Heading>
                  <Banner
                    label={`Your voting power of ${userBalance.balance} ${
                      userBalance.symbol
                    } is currently assigned to delegate ${truncateAddress(
                      delegation.data,
                    )}`}
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
            {!hasVoted && canVote && !hasDelegated ? (
              <ButtonGroup
                mb="40px"
                spacing="8px"
                display="flex"
                flexDirection="row"
                justifyContent="space-around"
              >
                {data.proposal?.choices.map((choice, index) => {
                  return (
                    <VoteButton
                      key={choice}
                      onClick={() => {
                        setcurrentChoice(index + 1);
                        setIsOpen(true);
                      }}
                      active={false}
                      // @ts-expect-error todo
                      type={choice}
                      label={`${choice}`}
                    />
                  );
                })}
              </ButtonGroup>
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
                  />
                );
              })}
            </Box>
            <Divider
              mb="standard.2xl"
              mt="standard.2xl"
              position="relative"
              left="-24px"
              width={`calc(100% + 48px)`}
            />
            <Box mb="standard.2xl">
              <Heading variant="h4" mb="standard.md">
                Votes
              </Heading>

              {votes.data?.votes?.map((vote, index) => (
                <VoteComment
                  key={index}
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
                />
              ))}
            </Box>
          </>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap="16px"
            height="100%"
            overflow="hidden"
          >
            <PlaceholderImage />
            <Heading variant="h3" fontSize="16px" color="#2A2A32">
              Voting starts{" "}
              {`${formatDate(data?.proposal?.start ?? 0, "yyyy-MM-dd", true)}`}
            </Heading>
            <Text textAlign="center" fontSize="12px" color="#4D4D56">
              The Builder’s council is excited about the new features but
              expects higher quality of documentation.
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export const documentProps = {
  title: "Proposals / Voting",
} satisfies DocumentProps;
