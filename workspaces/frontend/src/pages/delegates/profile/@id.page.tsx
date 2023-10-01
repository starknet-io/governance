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
  Stack,
  SummaryItems,
  MenuItem,
  EmptyState,
  AgreementModal,
  Link,
  StatusModal,
  Skeleton,
  SkeletonCircle,
  Banner,
  AvatarWithText,
  Button,
  Text,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useEffect, useState } from "react";
import { useAccount, useWaitForTransaction } from "wagmi";
import { usePageContext } from "src/renderer/PageContextProvider";
import {
  useDelegateRegistryClearDelegate,
  useDelegateRegistryDelegation,
  useDelegateRegistrySetDelegate,
} from "src/wagmi/DelegateRegistry";
import { useQuery } from "@apollo/client";
import { gql } from "src/gql";
import { useBalanceData } from "src/utils/hooks";
import { stringToHex } from "viem";
import { hasPermission } from "src/utils/helpers";
import { truncateAddress } from "@yukilabs/governance-components/src/utils";

const delegateInterests: Record<string, string> = {
  cairo_dev: "Cairo Dev",
  daos: "DAOs",
  governance: "Governance",
  identity: "Identity",
  infrastructure: "Infrastructure",
  infrastructure_starknet_dev: "Infrastructure Starknet dev",
  legal: "Legal",
  professional_delegate: "Professional delegate",
  security: "Security",
  starknet_community: "Starknet community",
  web3_community: "Web3 community",
  web3_developer: "Web3 developer",
  gaming: "Gaming",
  nft: "NFT",
  defi: "DeFi",
};

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
  const [isUndelegation, setIsUndelegation] = useState<boolean>(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
  const [statusTitle, setStatusTitle] = useState<string>("");
  const [statusDescription, setStatusDescription] = useState<string>("");
  const [showAgreement, setShowAgreement] = useState<boolean>(false);
  const { address } = useAccount();
  const { user } = usePageContext();
  // get delegation hash
  const [txHash, setTxHash] = useState("");
  // listen to txn with delegation hash
  const {
    isLoading: isDelegationLoading,
    isError: isDelegationError,
    isSuccess: isDelegationSuccess,
    error: delegationError,
  } = useWaitForTransaction({ hash: txHash as `0x${string}` });
  // handle delegation cases
  useEffect(() => {
    if (isDelegationLoading) {
      setIsStatusModalOpen(true);
      setStatusTitle(
        hasUserDelegatedTokensToThisDelegate
          ? "Tokens pending to undelegate"
          : "Tokens pending to delegate",
      );
      setStatusDescription("");
    }

    if (isDelegationError) {
      console.log(delegationError);
      setIsStatusModalOpen(true);
      setStatusTitle(
        hasUserDelegatedTokensToThisDelegate
          ? "Tokens undelegation failed"
          : "Tokens delegation failed",
      );
      setStatusDescription(
        "An error occurred while processing your transaction.",
      );
    }

    if (isDelegationSuccess) {
      setIsStatusModalOpen(true);
      setStatusTitle(
        hasUserDelegatedTokensToThisDelegate
          ? "Tokens delegated successfully"
          : "Tokens undelegated successfully",
      );
      setStatusDescription("");
    }
  }, [isDelegationLoading, isDelegationError, isDelegationSuccess]);

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
    watch: true,
    chainId: parseInt(import.meta.env.VITE_APP_DELEGATION_CHAIN_ID),
    enabled: address != null,
  });

  const {
    isLoading: isLoadingUndelegation,
    writeAsync: writeAsyncUndelegation,
  } = useDelegateRegistryClearDelegate({
    address: import.meta.env.VITE_APP_DELEGATION_REGISTRY,
    chainId: parseInt(import.meta.env.VITE_APP_DELEGATION_CHAIN_ID),
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
        <Flex gap={1}>
          <Text variant="small" color="content.accent.default">
            Yes -
          </Text>
          <Button
            top="-1px"
            left="-6px"
            variant="textSmall"
            onClick={() => setShowAgreement(true)}
          >
            View
          </Button>
        </Flex>
      );
    } else if (delegate?.customAgreement) {
      return (
        <Flex color="#292932" fontWeight="medium" gap={1}>
          <Text variant="small" color="content.accent.default">
            Custom -
          </Text>
          <Button
            top="-1px"
            left="-6px"
            variant="textSmall"
            onClick={() => setShowAgreement(true)}
          >
            View
          </Button>
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
        {canEdit && (
          <MenuItem as="a" href={`/delegates/profile/edit/${delegate?.id}`}>
            Edit
          </MenuItem>
        )}
        <MenuItem as="a" href="/delegate/edit/">
          Report
        </MenuItem>
      </>
    );
  }

  const isLoadingProfile = !delegateResponse.isFetched;
  const isLoadingSocials = !delegateResponse.isFetched;
  const isLoadingGqlResponse = !gqlResponse.data && !gqlResponse.error;
  const hasUserDelegatedTokensToThisDelegate =
    delegation.isFetched && delegation.data === delegateAddress;

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
        isUndelegation={isUndelegation}
        senderData={senderData}
        receiverData={{
          ...receiverData,
          vp: gqlResponse?.data?.vp?.vp,
        }}
        delegateTokens={() => {
          if (hasUserDelegatedTokensToThisDelegate) {
            writeAsyncUndelegation?.({
              args: [
                stringToHex(import.meta.env.VITE_APP_SNAPSHOT_SPACE, {
                  size: 32,
                }),
              ],
            })
              .then((tx) => {
                setTxHash(tx.hash);
              })
              .catch((err) => {
                setIsStatusModalOpen(true);
                setStatusTitle("Tokens undelegation failed");
                setStatusDescription(err.shortMessage);
              });
            setIsOpen(false);
          } else if (
            parseFloat(senderData?.balance) < MINIMUM_TOKENS_FOR_DELEGATION
          ) {
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
              .then((tx) => {
                setTxHash(tx.hash);
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
      <ConfirmModal
        isOpen={isLoading || isLoadingUndelegation}
        onClose={() => setIsOpen(false)}
      />
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
        isPending={isDelegationLoading}
        isSuccess={isDelegationSuccess}
        isFail={isDelegationError}
        onClose={() => {
          setIsStatusModalOpen(false);
        }}
        title={statusTitle}
        description={statusDescription}
      />
      <Box
        pt="standard.3xl"
        pb="standard.2xl"
        px={{ base: "standard.md", md: "standard.2xl", lg: "standard.xl" }}
        borderRight="1px solid"
        borderColor="border.dividers"
        display="flex"
        flexDirection="column"
        flexBasis={{ base: "100%", md: "372px" }}
        position={{ base: "unset", lg: "sticky" }}
        height="calc(100vh - 80px)"
        top="0"
        overflow="auto"
      >
        {isLoadingProfile ? (
          <Box display="flex" flexDirection="column" gap="12px" mb="18px">
            <Flex gap="20px" alignItems="center">
              {/* Avatar or Indenticon */}
              <SkeletonCircle size="64px" />

              <Flex flex="1" direction="column">
                {/* Header Text */}
                <Skeleton height="24px" width="70%" mb="4px" />

                {/* Subheader Text */}
                <Skeleton height="16px" width="50%" />
              </Flex>

              {/* Dropdown Skeleton */}
            </Flex>
            {/* Delegate Your Votes Button Skeleton */}
            <Skeleton height="44px" width="100%" borderRadius="md" />
          </Box>
        ) : (
          <AvatarWithText
            src={
              delegate?.author?.ensAvatar ||
              delegate?.author?.profileImage ||
              null
            }
            headerText={
              delegate?.author?.username ||
              delegate?.author?.ensName ||
              truncateAddress(delegateAddress)
            }
            subheaderText={
              delegate?.author?.username || delegate?.author?.ensName
                ? truncateAddress(delegateAddress)
                : null
            }
            address={delegateAddress}
            dropdownChildren={<ActionButtons />}
          />
        )}
        {user ? (
          <Button
            mt="standard.2xl"
            variant="primary"
            size="standard"
            onClick={() => {
              setIsOpen(true);
              if (hasUserDelegatedTokensToThisDelegate) {
                setIsUndelegation(true);
              }
            }}
          >
            {hasUserDelegatedTokensToThisDelegate
              ? "Undelegate your votes"
              : "Delegate your votes"}
          </Button>
        ) : (
          <></>
        )}
        <Box mt="standard.md">
          {delegation.isFetched && delegation.data === delegateAddress && (
            <Banner
              label={`Your voting power of ${senderData.balance} ${senderData.symbol} is currently assigned to this delegate.`}
            />
          )}

          {delegateResponse.isFetched && address === delegateAddress && (
            <Banner label="You can’t delegate votes to your own account." />
          )}
        </Box>
        <Box pt="standard.2xl" pb="standard.2xl">
          <SummaryItems.Root>
            <SummaryItems.Item
              isLoading={isLoadingGqlResponse}
              label="Proposals voted on"
              value={gqlResponse.data?.votes?.length.toString() || "0"}
            />
            <SummaryItems.Item
              isLoading={isLoadingGqlResponse}
              label="Delegated votes"
              value={(gqlResponse.data?.vp?.vp || 0).toString()}
            />
            <SummaryItems.Item
              isLoading={!delegateCommentsResponse.isFetched}
              label="Total comments"
              value={delegateCommentsResponse.data?.length.toString() || "0"}
            />
            <SummaryItems.Item
              isLoading={isLoadingGqlResponse}
              label="For/against/abstain"
              value={
                stats
                  ? `${stats[1] ?? 0}/${stats[2] ?? 0}/${stats[3] ?? 0}`
                  : "0/0/0"
              }
            />
            <SummaryItems.Item
              label="Delegation agreement"
              value={renderAgreementValue()}
            />
            <SummaryItems.Item
              isLoading={!delegateResponse.isFetched}
              isCopiable={!!delegate?.author?.starknetAddress}
              isTruncated={!!delegate?.author?.starknetAddress}
              label="Starknet address"
              value={delegate?.author?.starknetAddress || "None"}
            />
          </SummaryItems.Root>
        </Box>
        {isLoadingSocials ||
        delegate?.twitter ||
        delegate?.discourse ||
        delegate?.discord ? (
          <>
            <Divider mb="standard.2xl" />
            <SummaryItems.Root direction="row">
              {(isLoadingSocials || delegate?.twitter) && (
                <SummaryItems.Socials
                  label="twitter"
                  value={delegate?.twitter}
                  isLoading={isLoadingSocials}
                />
              )}
              {(isLoadingSocials || delegate?.discourse) && (
                <SummaryItems.Socials
                  label="discourse"
                  value={delegate?.discourse}
                  isLoading={isLoadingSocials}
                />
              )}
              {(isLoadingSocials || delegate?.discord) && (
                <SummaryItems.Socials
                  label="discord"
                  value={delegate?.discord}
                  isLoading={isLoadingSocials}
                />
              )}
            </SummaryItems.Root>
          </>
        ) : null}
        <Divider mt="standard.2xl" mb="standard.2xl" />
        <SummaryItems.Root>
          {isLoadingProfile ? (
            // Skeleton representation for interests tags
            <Flex gap="8px">
              <Skeleton height="24px" width="80px" borderRadius="md" />
              <Skeleton height="24px" width="100px" borderRadius="md" />
              <Skeleton height="24px" width="90px" borderRadius="md" />
              {/* Add or remove skeletons based on expected number of tags */}
            </Flex>
          ) : Array.isArray(delegate?.interests) ? (
            delegate?.interests?.map((item: any) => (
              <SummaryItems.Tags
                key={item}
                type={delegateInterests[item] || item}
              />
            ))
          ) : (
            <></>
          )}
        </SummaryItems.Root>
      </Box>

      <ContentContainer maxWidth="800px" center>
        <Stack
          spacing="0"
          direction={{ base: "column" }}
          color="content.default.default"
          width="100%"
        >
          <Heading color="content.accent.default" variant="h2">
            Delegate pitch
          </Heading>
          <Box mt="standard.2xl">
            {isLoadingProfile ? (
              <Box display="flex" flexDirection="column" gap="20px">
                <Skeleton height="40px" width="100%" />
                <Skeleton height="300px" width="90%" />
                <Skeleton height="100px" width="80%" />
              </Box>
            ) : (
              <MarkdownRenderer content={delegate?.statement || ""} />
            )}
          </Box>
          <Box mt="24px">
            <Heading mb="24px" color="content.accent.default" variant="h3">
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
              <EmptyState type="votesCast" title="No votes yet" />
            )}
          </Box>
          <Box mt="24px" mb={10}>
            <Heading mb="24px" color="content.accent.default" variant="h3">
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
              <EmptyState type="comments" title="No comments yet" />
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
