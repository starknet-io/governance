import { DocumentProps } from "src/renderer/types";
import { useState } from "react";
import {
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
  HiEllipsisHorizontal,
  IconButton,
  InfoModal,
  LinkCard,
  PlaceholderImage,
  QuillEditor,
  Stack,
  Stat,
  SummaryItems,
  Text,
  Textarea,
  VoteButton,
  VoteComment,
  VoteModal,
  VoteReview,
  VoteStat,
} from "@yukilabs/governance-components";
import { gql } from "src/gql";
import { useQuery } from "@apollo/client";
import { usePageContext } from "src/renderer/PageContextProvider";
import { formatDate } from "@yukilabs/governance-components/src/utils/helpers";
import { useWalletClient } from "wagmi";
import snapshot from "@snapshot-labs/snapshot.js";
import { providers } from "ethers";
import { Vote } from "@snapshot-labs/snapshot.js/dist/sign/types";
import { set } from "react-hook-form";
import { useDynamicContext } from "@dynamic-labs/sdk-react";
import { trpc } from "src/utils/trpc";

export function Page() {
  const pageContext = usePageContext();
  const { data: walletClient } = useWalletClient();

  const { data } = useQuery(
    gql(`query Proposal($voter: String!, $space: String!, $proposal: String) {
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
      vp(voter: $voter, space: $space, proposal: $proposal) {
        vp
        vp_by_strategy
        vp_state
      }
    }`),
    {
      variables: {
        proposal: pageContext.routeParams!.id,
        space: "robwalsh.eth",
        voter: walletClient?.account.address as any,
      },
    }
  );

  async function handleVote(choice: number, reason?: string) {
    try {
      if (walletClient == null) return;

      // const client = new snapshot.Client712('https://testnet.snapshot.org');
      const client = new snapshot.Client712("https://hub.snapshot.org");

      const web3 = new providers.Web3Provider(
        walletClient.transport,
        walletClient?.chain != null
          ? {
              chainId: walletClient.chain.id,
              name: walletClient.chain.name,
              ensAddress: walletClient.chain.contracts?.ensRegistry?.address,
            }
          : undefined
      );

      const params: Vote = {
        // from?: string;
        space: "robwalsh.eth",
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

      const receipt = (await client.vote(
        web3,
        walletClient.account.address,
        params
      )) as any;
      setisConfirmOpen(false);
      setisSuccessModalOpen(true);
      console.log(receipt);
    } catch (error) {
      // Handle error
      console.log(error);
    }
  }

  const commentCount = 0;
  console.log(JSON.stringify(data, null, 2));
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [isConfirmOpen, setisConfirmOpen] = useState(false);
  const [isSuccessModalOpen, setisSuccessModalOpen] = useState(false);
  const [currentChoice, setcurrentChoice] = useState<number>(0);
  const [comment, setComment] = useState("");
  const { user } = useDynamicContext();
  const comments = trpc.comments.getProposalComments.useQuery({
    proposalId: data?.proposal?.id ?? "",
  });
  const saveComment = trpc.comments.saveComment.useMutation({
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

  if (data == null) return null;
  return (
    <Box
      display="flex"
      flexDirection={{ base: "column", md: "column", lg: "row" }}
      flex="1"
      height="100%"
    >
      <VoteModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <VoteReview choice={currentChoice} voteCount={10} />
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
          variant="solid"
          size="lg"
          onClick={() => handleVote(currentChoice, comment)}
        >
          Submit vote
        </Button>
      </VoteModal>
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
        <Button variant="solid" onClick={() => setIsInfoOpen(false)}>
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
        <Button variant="solid" onClick={() => setisSuccessModalOpen(false)}>
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
                icon={<HiEllipsisHorizontal size="24px" />}
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
                <Stat.Date timestamp={data?.proposal?.start} />
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
              <Box mt="24px" mb="24px">
                <LinkCard
                  href={`${data?.proposal?.discussion}`}
                  title={`${data?.proposal?.discussion}`}
                />
              </Box>
            ) : (
              <></>
            )}

            <QuillEditor readOnly value={data?.proposal?.body} />
          </Stack>
          {user ? (
            <FormControl id="delegate-statement">
              <CommentInput onSend={handleCommentSend} />
            </FormControl>
          ) : (
            <></>
          )}
          <Box marginTop="3rem">
            <CommentList commentsList={comments.data || []} />
          </Box>
        </Box>
      </ContentContainer>
      <Box
        pt="40px"
        px="32px"
        borderLeft="1px solid #E7E8E9"
        display="flex"
        flexDirection="column"
        flexBasis={{ base: "100%", md: "391px" }}
        height="100%"
        pb="100px"
      >
        {data?.proposal?.state === "active" ? (
          <>
            <Heading variant="h4" mb="16px" fontWeight="500 " fontSize="16px">
              Cast your vote
            </Heading>
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
                    type={choice}
                    label={`${choice}`}
                  />
                );
              })}
            </ButtonGroup>
            <Divider mb="40px" />
            <Box mb="40px">
              <Heading variant="h4" mb="16px" fontWeight="500 " fontSize="16px">
                Results
              </Heading>

              {data?.proposal?.choices.map((choice, index) => {
                const totalVotes = data?.proposal?.scores?.reduce(
                  (a, b) => a + b,
                  0
                );
                const voteCount = data?.proposal?.scores[index];
                const userVote = false;
                const strategies = data?.proposal?.strategies;
                const scoresByStrategy =
                  data?.proposal?.scores_by_strategy[index];
                return (
                  <VoteStat
                    key={choice}
                    type={choice}
                    totalVotes={totalVotes}
                    voteCount={voteCount}
                    userVote={userVote}
                    strategies={strategies}
                    scoresByStrategy={scoresByStrategy}
                  />
                );
              })}
            </Box>
            <Divider mb="40px" />
            <Box mb="40px">
              <Heading variant="h4" mb="16px" fontWeight="500 " fontSize="16px">
                Votes
              </Heading>
              r
              <VoteComment />
              {/* <VoteComment voted="Against" />
              <VoteComment voted="Abstain" />
              <VoteComment /> */}
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
