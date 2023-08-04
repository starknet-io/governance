/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DocumentProps } from "src/renderer/types";

import {
  Box,
  ConfirmModal,
  ContentContainer,
  DelegateModal,
  Divider,
  Heading,
  QuillEditor,
  ListRow,
  ProfileSummaryCard,
  Stack,
  SummaryItems,
  MenuItem,
  Status,
  EmptyState,
  Link,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useState } from "react";
import { useAccount } from "wagmi";
import { usePageContext } from "src/renderer/PageContextProvider";
import {
  useDelegateRegistryDelegation,
  useDelegateRegistrySetDelegate,
} from "src/wagmi/DelegateRegistry";
import { useQuery } from "@apollo/client";
import { gql } from "src/gql";
import { useBalanceData } from "src/utils/hooks";
import { stringToHex } from "viem";

const GET_PROPOSALS_FOR_DELEGATE_QUERY = gql(`
  query DelegateProposals($space: String!) {
    proposals(first: 20, skip: 0, where: {space_in: [$space]}, orderBy: "created", orderDirection: desc) {
      id
      title
      choices
      start
      end
      snapshot
      state
      scores
      scores_total
      author
      space {
        id
        name
      }
    }
  }
`);

const DELEGATE_PROFILE_PAGE_QUERY = gql(`
  query DelegateProfilePageQuery(
    $voter: String!
    $space: String!
    $proposal: String
    $where: VoteWhere
  ) {
    votes(where: $where) {
      id
      choice
      voter
      reason
      metadata
      created
      proposal {
        id
        title
        body
      }
      ipfs
      vp
      vp_by_strategy
      vp_state
    }
    vp(voter: $voter, space: $space, proposal: $proposal) {
      vp
      vp_by_strategy
      vp_state
    }
  }
`);

export function Page() {
  const pageContext = usePageContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { address, isConnected } = useAccount();

  const { isLoading, write } = useDelegateRegistrySetDelegate({
    address: import.meta.env.VITE_APP_DELEGATION_REGISTRY,
    chainId: parseInt(import.meta.env.VITE_APP_DELEGATION_CHAIN_ID),
  });

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

  const delegateId = pageContext.routeParams!.id;

  const delegateResponse = trpc.delegates.getDelegateById.useQuery({
    id: delegateId,
  });

  const delegateCommentsResponse = trpc.delegates.getDelegateComments.useQuery({
    delegateId,
  });

  const delegate = delegateResponse.data;
  const delegateAddress = delegate?.author?.address as `0x${string}`;

  const gqlResponse = useQuery(DELEGATE_PROFILE_PAGE_QUERY, {
    variables: {
      space: import.meta.env.VITE_APP_SNAPSHOT_SPACE,
      voter: delegateAddress,
      where: {
        voter: delegateAddress,
        space: import.meta.env.VITE_APP_SNAPSHOT_SPACE,
      },
    },
    skip: delegateAddress == null,
  });

  const gqlResponseProposalsByUser = useQuery(
    GET_PROPOSALS_FOR_DELEGATE_QUERY,
    {
      variables: {
        space: import.meta.env.VITE_APP_SNAPSHOT_SPACE,
        where: {
          space: import.meta.env.VITE_APP_SNAPSHOT_SPACE,
        },
      },
      skip: delegateAddress == null,
    },
  );

  const proposals = gqlResponseProposalsByUser?.data?.proposals || [];

  const senderData = useBalanceData(address);
  const receiverData = useBalanceData(delegateAddress);

  const stats = gqlResponse.data?.votes?.reduce(
    (acc: { [key: string]: number }, vote) => {
      acc[vote!.choice] = (acc[vote!.choice] || 0) + 1;
      return acc;
    },
    {},
  );

  const comments = (delegateCommentsResponse?.data || []).map((comment) => {
    const foundProposal = proposals.find(
      (proposal) => proposal?.id === comment.proposalId,
    );
    return {
      id: comment.id,
      content: comment.content,
      title: foundProposal?.title,
      proposalId: comment.proposalId,
      snipId: comment.snipId,
      snipTitle: comment.snipTitle,
    };
  });

  return (
    <Box
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      flex="1"
      height="100%"
    >
      <DelegateModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isConnected
        senderData={senderData}
        receiverData={receiverData}
        delegateTokens={() => {
          write?.({
            args: [
              stringToHex(import.meta.env.VITE_APP_SNAPSHOT_SPACE, {
                size: 32,
              }),
              delegateAddress,
            ],
          });
          setIsOpen(false);
        }}
      />
      <ConfirmModal isOpen={isLoading} onClose={() => setIsOpen(false)} />
      <Box
        pt="40px"
        px="32px"
        borderRight="1px solid #E7E8E9"
        display="flex"
        flexDirection="column"
        flexBasis={{ base: "100%", md: "391px" }}
        position={{ base: "unset", lg: "sticky" }}
        height="calc(100vh - 80px)"
        top="0"
      >
        <ProfileSummaryCard.Root>
          <ProfileSummaryCard.Profile
            imgUrl={delegate?.author?.ensAvatar}
            ensName={delegate?.author?.ensName}
            address={delegate?.author?.ensName || delegateAddress}
            avatarString={delegate?.author?.ensAvatar || delegateAddress}
          >
            <ProfileSummaryCard.MoreActions>
              <MenuItem as="a" href={`/delegates/profile/edit/${delegate?.id}`}>
                Edit
              </MenuItem>
              <MenuItem as="a" href={`/delegate/edit/`}>
                Report
              </MenuItem>
            </ProfileSummaryCard.MoreActions>
          </ProfileSummaryCard.Profile>
          {isConnected ? (
            <ProfileSummaryCard.PrimaryButton
              label="Delegate your votes"
              onClick={() => setIsOpen(true)}
            />
          ) : (
            <></>
          )}
        </ProfileSummaryCard.Root>
        <Box mt="24px">
          {delegation.isFetched && delegation.data === delegateAddress && (
            <Status
              label={`Your voting power of ${senderData.balance} ${senderData.symbol} is currently assigned to this delegate.`}
            />
          )}

          {delegateResponse.isFetched && address === delegateAddress && (
            <Status label="You can’t delegate votes to your own account." />
          )}
        </Box>

        <Box mt="32px">
          <SummaryItems.Root>
            <SummaryItems.Item
              label="Proposals voted on"
              value={gqlResponse.data?.votes?.length.toString() ?? ""}
            />
            <SummaryItems.Item
              label="Delegated votes"
              value={gqlResponse.data?.vp?.vp?.toString()}
            />
            <SummaryItems.Item
              label="Total comments"
              value={delegateCommentsResponse.data?.length.toString()}
            />
            <SummaryItems.Item
              label="For/against/abstain"
              value={
                stats && `${stats[1] ?? 0}/${stats[2] ?? 0}/${stats[3] ?? 0}`
              }
            />
            <SummaryItems.Item
              label="Delegation agreement"
              value={
                delegate != null ? (delegate?.agreeTerms ? "Yes" : "No") : null
              }
            />
            <SummaryItems.Item
              isCopiable
              isTruncated
              label="Starknet address"
              value={delegate?.starknetWalletAddress}
            />
          </SummaryItems.Root>
        </Box>
        <Divider mt="32px" mb="32px" />
        <SummaryItems.Root direction="row">
          {delegate?.twitter && (
            <SummaryItems.Socials label="twitter" value={delegate?.twitter} />
          )}
          {delegate?.discourse && (
            <SummaryItems.Socials
              label="discourse"
              value={delegate?.discourse}
            />
          )}
          {delegate?.discord && (
            <SummaryItems.Socials label="discord" value={delegate?.discord} />
          )}
        </SummaryItems.Root>
        <Divider mt="32px" mb="32px" />
        <SummaryItems.Root>
          {Array.isArray(delegate?.delegateType) ? (
            delegate?.delegateType?.map((item: any) => (
              <SummaryItems.Tags key={item} type={item} />
            ))
          ) : (
            <></>
          )}
        </SummaryItems.Root>
      </Box>

      <ContentContainer maxWidth="800px" center>
        <Stack
          spacing="24px"
          direction={{ base: "column" }}
          color="#545464"
          width="100%"
        >
          <Heading color="#33333E" variant="h3">
            Delegate pitch
          </Heading>
          {/* <MarkdownRenderer content={delegate?.delegateStatement || ""} /> */}
          <QuillEditor value={delegate?.delegateStatement} readOnly />
          <Box mt="24px">
            <Heading mb="24px" color="#33333E" variant="h3">
              Past Votes
            </Heading>
            {gqlResponse.data?.votes?.length ? (
              <ListRow.Container>
                {gqlResponse.data?.votes.map((vote) => (
                  <Link
                    href={`/voting-proposals/${vote!.proposal!.id}`}
                    key={vote!.id}
                    _hover={{ textDecoration: "none" }} // disable underline on hover for the Link itself
                  >
                    <ListRow.Root>
                      <ListRow.PastVotes
                        title={vote?.proposal?.title}
                        voteCount={vote!.vp}
                        body={vote?.proposal?.body}
                      />
                    </ListRow.Root>
                  </Link>
                ))}
              </ListRow.Container>
            ) : (
              <EmptyState type="votes" title="No past votes" />
            )}
          </Box>
          <Box mt="24px" mb={10}>
            <Heading mb="24px" color="#33333E" variant="h3">
              Comments
            </Heading>
            <ListRow.Container>
              {comments.map((comment) => {
                return (
                  <Link
                    key={comment!.id as string}
                    href={
                      comment?.proposalId
                        ? `/voting-proposals/${comment!.proposalId}`
                        : `/snips/${comment!.snipId}`
                    }
                    _hover={{ textDecoration: "none" }} // disable underline on hover for the Link itself
                  >
                    <ListRow.Root>
                      <ListRow.CommentSummary
                        comment={(comment?.content as string) || ""}
                        postTitle={
                          (comment?.title as string) ||
                          (comment?.snipTitle as string) ||
                          ""
                        }
                      />
                    </ListRow.Root>
                  </Link>
                );
              })}
            </ListRow.Container>

            {!delegateCommentsResponse?.data?.length ? (
              <EmptyState type="posts" title="No post comments" />
            ) : null}
          </Box>
        </Stack>
      </ContentContainer>
    </Box>
  );
}

export const documentProps = {
  title: "Delegates / profile",
} satisfies DocumentProps;
