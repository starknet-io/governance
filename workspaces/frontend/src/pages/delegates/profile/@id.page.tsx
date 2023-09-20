/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DocumentProps, ROLES } from "src/renderer/types";

import {
  Box,
  ConfirmModal,
  ContentContainer,
  DelegateModal,
  Divider,
  Flex,
  Heading,
  ListRow,
  MarkdownRenderer,
  ProfileSummaryCard,
  Stack,
  SummaryItems,
  MenuItem,
  Status,
  EmptyState,
  AgreementModal,
  Link,
  StatusModal,
  Skeleton,
  SkeletonCircle,
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
import { hasPermission } from "src/utils/helpers";

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

// This is just for now
const mockAgreement = `
    <h1>Agreement Understanding</h1>
    <p>
      This agreement pertains to the role and responsibilities within StarkNet.
      Please review the following documents to ensure a complete understanding
      of the expectations and guidelines.
    </p>

    <h2>StarkNet Delegates</h2>
    <p>
      <a href="url_to_delegate_expectations_328">Delegate Expectations 328</a>
    </p>

    <h2>Starknet Governance Announcements</h2>
    <p>
      <a href="url_to_part_1_98">Part 1 98</a>
      <br />
      <a href="url_to_part_2_44">Part 2 44</a>
      <br />
      <a href="url_to_part_3_34">Part 3 34</a>
    </p>

    <h2>The Foundation Post</h2>
    <p>
      <a href="url_to_foundation_post_60">Foundation Post 60</a>
    </p>

    <h2>Delegate Onboarding</h2>
    <p>
      <a href="url_to_onboarding_announcement_539">
        Delegate Onboarding Announcement 539
      </a>
    </p>

    <p>
      By proceeding further, you acknowledge that you understand the role of
      StarkNet delegates and have read all the required documents mentioned
      above.
    </p>
  `;

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
        choices
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

// Extract this to some constants file
export const MINIMUM_TOKENS_FOR_DELEGATION = 1;

export function Page() {
  const pageContext = usePageContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
  const [statusTitle, setStatusTitle] = useState<string>("");
  const [statusDescription, setStatusDescription] = useState<string>("");
  const [showAgreement, setShowAgreement] = useState<boolean>(false);
  const { address, isConnected } = useAccount();
  const { user } = usePageContext();

  const { isLoading, writeAsync } = useDelegateRegistrySetDelegate({
    address: import.meta.env.VITE_APP_DELEGATION_REGISTRY,
    chainId: parseInt(import.meta.env.VITE_APP_DELEGATION_CHAIN_ID),
  });

  const delegation = useDelegateRegistryDelegation({
    address: import.meta.env.VITE_APP_DELEGATION_REGISTRY,
    args: [
      address!,
      stringToHex(import.meta.env.VITE_APP_SNAPSHOT_SPACE, { size: 32 }),
    ],
    watch: false,
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

  const renderAgreementValue = () => {
    if (delegate?.confirmDelegateAgreement) {
      return (
        <Flex color="#292932" fontWeight="medium" gap={1}>
          <div>Yes</div>-
          <button onClick={() => setShowAgreement(true)}>View</button>
        </Flex>
      );
    } else if (delegate?.customAgreement) {
      return (
        <Flex color="#292932" fontWeight="medium" gap={1}>
          <div>Custom</div>-
          <button onClick={() => setShowAgreement(true)}>View</button>
        </Flex>
      );
    } else {
      return "None";
    }
  };

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

  function ActionButtons() {
    if (!user) return null;

    const canEdit =
      (hasPermission(user.role, [ROLES.USER]) &&
        user.delegationStatement?.id === delegateId) ||
      hasPermission(user.role, [ROLES.ADMIN, ROLES.MODERATOR]);

    return (
      <>
        <ProfileSummaryCard.MoreActions>
          {canEdit && (
            <MenuItem as="a" href={`/delegates/profile/edit/${delegate?.id}`}>
              Edit
            </MenuItem>
          )}
          <MenuItem as="a" href="/delegate/edit/">
            Report
          </MenuItem>
        </ProfileSummaryCard.MoreActions>
      </>
    );
  }

  const isLoadingProfile = !delegateResponse.isFetched;
  const isLoadingVotes = !gqlResponse.loading;
  const isLoadingComments = !delegateCommentsResponse.isFetched;
  const isLoadingSummary = !gqlResponse.loading || !delegateResponse.isLoading;

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
        receiverData={{
          ...receiverData,
          vp: gqlResponse?.data?.vp?.vp,
        }}
        delegateTokens={() => {
          if (parseFloat(senderData?.balance) < MINIMUM_TOKENS_FOR_DELEGATION) {
            setIsStatusModalOpen(true);
            setStatusTitle("No voting power");
            setStatusDescription(
              `You do not have enough tokens in your account to vote. You need at least ${MINIMUM_TOKENS_FOR_DELEGATION} tokens to vote.`,
            );
            setIsOpen(false);
          } else {
            writeAsync?.({
              args: [
                stringToHex(import.meta.env.VITE_APP_SNAPSHOT_SPACE, {
                  size: 32,
                }),
                delegateAddress,
              ],
            })
              .then(() => {
                setIsStatusModalOpen(true);
                setStatusTitle("Tokens delegated successfully");
                setStatusDescription("");
              })
              .catch((err) => {
                setIsStatusModalOpen(true);
                setStatusTitle("Tokens delegation failed");
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
      <AgreementModal
        isOpen={showAgreement}
        onClose={() => setShowAgreement(false)}
        content={
          delegate?.customAgreement
            ? delegate!.customAgreement!.content
            : mockAgreement
        }
      />
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
        {isLoadingProfile ? (
          <Box
            display="flex"
            flexDirection="column"
            gap="12px"
            padding="12px"
            mb="24px"
          >
            <Flex gap="20px" alignItems="center">
              <SkeletonCircle size="60px" />
              <Skeleton height="24px" width="70%" />
            </Flex>
            {/* Profile Image */}
            <Skeleton height="44px" width="100%" /> {/* ENS Name */}
          </Box>
        ) : (
          <ProfileSummaryCard.Root>
            <ProfileSummaryCard.Profile
              imgUrl={delegate?.author?.ensAvatar}
              ensName={delegate?.author?.ensName}
              address={delegate?.author?.ensName || delegateAddress}
              avatarString={delegate?.author?.ensAvatar || delegateAddress}
            >
              <ActionButtons />
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
        )}

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
              value={renderAgreementValue()}
            />
            <SummaryItems.Item
              isCopiable
              isTruncated
              label="Starknet address"
              value={delegate?.author?.starknetAddress ?? ""}
            />
          </SummaryItems.Root>
          {/* {isLoadingSummary ? (
            <Box
              display="flex"
              flexDirection="column"
              gap="12px"
              padding="12px"
              mb="24px"
            >
              <Skeleton height="36px" width="100%" />
              <Skeleton height="36px" width="100%" />
              <Skeleton height="36px" width="100%" />
              <Skeleton height="36px" width="100%" />
              <Skeleton height="36px" width="100%" />
              <Skeleton height="36px" width="100%" />
              <Skeleton height="100px" width="100%" />
              <Skeleton height="36px" width="100%" />
            </Box>
          ) : (
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
                value={renderAgreementValue()}
              />
              <SummaryItems.Item
                isCopiable
                isTruncated
                label="Starknet address"
                value={delegate?.author?.starknetAddress ?? ""}
              />
            </SummaryItems.Root>
          )} */}
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
          {Array.isArray(delegate?.interests) ? (
            delegate?.interests?.map((item: any) => (
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
          <MarkdownRenderer content={delegate?.statement || ""} />
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
                        votePreference={
                          vote!.proposal!.choices?.[
                            vote!.choice - 1
                          ]?.toLowerCase() as "for" | "against" | "abstain"
                        }
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
              <EmptyState type="posts" title="No past comments" />
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
