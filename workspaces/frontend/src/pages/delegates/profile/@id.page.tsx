/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DocumentProps, ROLES } from "src/renderer/types";
import { Button as ChakraButton } from "@chakra-ui/react";
import {
  Box,
  ConfirmModal,
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
import React, { useEffect, useState } from "react";
import { useAccount, useWaitForTransaction } from "wagmi";
import { usePageContext } from "src/renderer/PageContextProvider";
import {
  useL1StarknetDelegationDelegate,
  useL1StarknetDelegationDelegates,
} from "../../../wagmi/L1StarknetDelegation";
import { useBalanceData } from "src/utils/hooks";
import { hasPermission } from "src/utils/helpers";
import { truncateAddress } from "@yukilabs/governance-components/src/utils";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import * as ProfilePageLayout from "../../../components/ProfilePageLayout/ProfilePageLayout";
import { BackButton } from "src/components/Header/BackButton";
import { useHelpMessage } from "src/hooks/HelpMessage";
import { delegationAgreement } from "src/utils/data";
import { useVotes } from "../../../hooks/snapshotX/useVotes";
import { useVotingPower } from "../../../hooks/snapshotX/useVotingPower";
import { useProposals } from "../../../hooks/snapshotX/useProposals";
import Socials from "../../../components/SocialLogin";

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

// Extract this to some constants file
export const MINIMUM_TOKENS_FOR_DELEGATION = 0;

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
  const { user: dynamicUser, walletConnector } = useDynamicContext();

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
    if (isDelegationLoading && dynamicUser) {
      setIsStatusModalOpen(true);
      setStatusTitle(
        hasUserDelegatedTokensToThisDelegate
          ? "Undelegating your votes"
          : "Delegating your votes",
      );
      setStatusDescription("");
    }

    if (isDelegationError && dynamicUser) {
      setIsStatusModalOpen(true);
      setStatusTitle(
        isUndelegation
          ? "Undelegating voting power failed"
          : "Delegating voting power failed",
      );
      setIsUndelegation(false);
      setStatusDescription(
        "An error occurred while processing your transaction.",
      );
    }

    if (isDelegationSuccess && dynamicUser) {
      setIsStatusModalOpen(true);
      setStatusTitle(
        isUndelegation
          ? "Votes undelegated successfully"
          : "Votes delegated successfully",
      );
      setStatusDescription("");
      setIsUndelegation(false);
    }
  }, [isDelegationLoading, isDelegationError, isDelegationSuccess]);

  const { isLoading, writeAsync } = useL1StarknetDelegationDelegate({
    address: import.meta.env.VITE_APP_STARKNET_REGISTRY! as `0x${string}`,
  });

  const delegation = useL1StarknetDelegationDelegates({
    address: import.meta.env.VITE_APP_STARKNET_REGISTRY,
    args: [address!],
    watch: true,
    enabled: address != null,
  });

  const {
    isLoading: isLoadingUndelegation,
    writeAsync: writeAsyncUndelegation,
  } = useL1StarknetDelegationDelegate({
    address: import.meta.env.VITE_APP_STARKNET_REGISTRY,
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

  const { data: votesData, loading: votesLoading } = useVotes({
    voter: delegateAddress,
    skipField: "voter",
  });

  const gqlResponse = useVotingPower({
    address: delegateAddress,
  });

  const gqlResponseProposalsByUser = useProposals();

  const proposals = gqlResponseProposalsByUser?.data || [];

  const findProposalTitleByVote = (proposalId) =>
    proposals?.find((proposal) => proposal.id === proposalId)?.title || "";

  const senderData = useBalanceData(address);
  const receiverData = useBalanceData(delegateAddress);

  const allVotes = votesData?.votes || [];

  const stats = allVotes.reduce((acc: { [key: string]: number }, vote) => {
    acc[vote!.choice] = (acc[vote!.choice] || 0) + 1;
    return acc;
  }, {});

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
      createdAt: comment.createdAt,
    };
  });

  function ActionButtons() {
    if (!user)
      return (
        <ChakraButton
          variant="ghost"
          onClick={() => setHelpMessage("connectWalletMessage")}
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
      );

    const canEdit =
      (hasPermission(user.role, [ROLES.USER]) &&
        user.delegationStatement?.id === delegateId) ||
      hasPermission(user.role, [
        ROLES.ADMIN,
        ROLES.SUPERADMIN,
        ROLES.MODERATOR,
      ]);

    return (
      <>
        {canEdit && (
          <MenuItem as="a" href={`/delegates/profile/edit/${delegate?.id}`}>
            Edit
          </MenuItem>
        )}
        <ChakraButton
          variant="ghost"
          data-tally-open="mDpzpE"
          data-tally-emoji-text="👋"
          data-tally-emoji-animation="wave"
          data-profile={
            typeof window !== "undefined" ? window.location.href : ""
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
      </>
    );
  }

  const isLoadingProfile = !delegateResponse.isFetched;
  const isLoadingSocials = !delegateResponse.isFetched;
  const isLoadingGqlResponse = gqlResponse.isLoading;
  const hasUserDelegatedTokensToThisDelegate =
    delegation.isFetched &&
    delegation.data?.toLowerCase() === delegateAddress?.toLowerCase();

  const delegateOwnProfile =
    delegateAddress &&
    delegateAddress?.toLowerCase() === address?.toLowerCase();
  const [helpMessage, setHelpMessage] = useHelpMessage();
  return (
    <ProfilePageLayout.Root>
      <DelegateModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isConnected
        isUndelegation={isUndelegation}
        senderData={senderData}
        receiverData={{
          ...receiverData,
          vp: gqlResponse?.data,
        }}
        delegateTokens={() => {
          if (parseFloat(senderData?.balance) < MINIMUM_TOKENS_FOR_DELEGATION) {
            setIsStatusModalOpen(true);
            setStatusTitle("No voting power");
            setStatusDescription(
              `You do not have enough tokens in your account to delegate. You need at least ${MINIMUM_TOKENS_FOR_DELEGATION} tokens to delegate.`,
            );
            setIsOpen(false);
          } else {
            const deeplink = walletConnector?.getDeepLink();
            if (deeplink) {
              window.location.href = deeplink;
            }
            writeAsync?.({
              args: [delegateAddress],
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
            : delegationAgreement
        }
      />
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
      <ProfilePageLayout.Profile>
        <Box mb="standard.2xl" display={{ lg: "none" }}>
          <BackButton
            buttonText="Delegates"
            urlStart={["/delegates/"]}
            href="/delegates"
            pageContext={pageContext}
          />
        </Box>

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
          </Box>
        ) : (
          <>
            <AvatarWithText
              src={
                delegate?.author?.profileImage ||
                delegate?.author?.ensAvatar ||
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
              withCopy
              address={delegateAddress}
              dropdownChildren={<ActionButtons />}
              headerTooltipContent={
                !delegate?.author?.username && !delegate?.author?.ensName
                  ? delegateAddress
                  : undefined
              }
              subheaderTooltipContent={
                delegate?.author?.username || delegate?.author?.ensName
                  ? delegateAddress
                  : undefined
              }
            />
          </>
        )}

        {user && !delegateOwnProfile ? (
          <Button
            mt={{ base: "standard.2xl" }}
            mb="0"
            width={{ base: "100%" }}
            variant="primary"
            size="standard"
            onClick={() => {
              if (
                parseFloat(senderData?.balance) <
                  MINIMUM_TOKENS_FOR_DELEGATION &&
                !hasUserDelegatedTokensToThisDelegate
              ) {
                setIsStatusModalOpen(true);
                setStatusTitle("No voting power");
                setStatusDescription(
                  `You do not have enough tokens in your account to delegate. You need at least ${MINIMUM_TOKENS_FOR_DELEGATION} token to delegate.`,
                );
                setIsOpen(false);
                return;
              }
              setIsOpen(true);
              if (hasUserDelegatedTokensToThisDelegate) {
                setIsUndelegation(true);
                writeAsyncUndelegation?.({
                  args: ["0x0000000000000000000000000000000000000000"],
                })
                  .then((tx) => {
                    setTxHash(tx.hash);
                  })
                  .catch((err) => {
                    setIsStatusModalOpen(true);
                    setStatusTitle("Undelegating voting power failed");
                    setStatusDescription(err.shortMessage);
                  });
                setIsOpen(false);
              } else {
                setIsUndelegation(false);
              }
            }}
          >
            {hasUserDelegatedTokensToThisDelegate &&
            delegation?.data &&
            delegation.data !== "0x0000000000000000000000000000000000000000"
              ? "Undelegate voting power"
              : "Delegate voting power"}
          </Button>
        ) : !user ? (
          <Button
            mt={{ base: "standard.2xl" }}
            mb="0"
            width={{ base: "100%" }}
            variant="primary"
            size="standard"
            onClick={() => setHelpMessage("connectWalletMessage")}
          >
            Delegate voting power
          </Button>
        ) : null}

        {delegation.isFetched &&
          delegation.data?.toLowerCase() === delegateAddress?.toLowerCase() && (
            <Box mt="standard.md">
              <Banner
                label={`Your voting power of ${senderData.balance} ${senderData.symbol} is currently assigned to this delegate.`}
              />
            </Box>
          )}
        {/*
        {delegateResponse.isFetched &&
          address?.toLowerCase() === delegateAddress?.toLowerCase() && (
            <Box mt="standard.md">
              <Banner label="You can’t delegate voting power to your own account." />
            </Box>
          )}
          */}

        <Box mt="standard.2xl" pb="standard.2xl">
          <SummaryItems.Root>
            <SummaryItems.Item
              isLoading={isLoadingGqlResponse}
              label="Proposals voted on"
              value={allVotes?.length.toString() || "0"}
            />
            <SummaryItems.Item
              isLoading={isLoadingGqlResponse}
              label="Delegated votes"
              value={(gqlResponse.data || 0).toLocaleString()}
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
          <Divider mt="standard.2xl" />
        </Box>
        <Socials
          delegateId={delegateId}
          socials={{
            twitter: delegate?.twitter,
            discord: delegate?.discord,
            discourse: delegate?.discourse,
            telegram: delegate?.telegram,
          }}
        />

        <SummaryItems.Root>
          {isLoadingProfile ? (
            <Flex gap="8px">
              <Skeleton height="24px" width="80px" borderRadius="md" />
              <Skeleton height="24px" width="100px" borderRadius="md" />
              <Skeleton height="24px" width="90px" borderRadius="md" />
            </Flex>
          ) : Array.isArray(delegate?.interests) ? (
            delegate?.interests?.map((item: any) => {
              const interestValue =
                typeof item === "string" ? item : item.value;
              return (
                <SummaryItems.Tags
                  key={interestValue}
                  type={delegateInterests[interestValue] || interestValue}
                />
              );
            })
          ) : (
            <></>
          )}
        </SummaryItems.Root>
      </ProfilePageLayout.Profile>

      <ProfilePageLayout.About>
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
              // Skeleton representation for loading state
              <Box display="flex" flexDirection="column" gap="20px">
                <Skeleton height="40px" width="100%" />
                <Skeleton height="300px" width="90%" />
                <Skeleton height="100px" width="80%" />
              </Box>
            ) : delegate?.statement ? (
              // Display the actual content if it's available
              <MarkdownRenderer content={delegate?.statement} />
            ) : (
              // Empty state if the data is available but contains no content
              <Text variant="body">No delegate pitch added</Text>
            )}
          </Box>
          <Box mt="standard.2xl">
            <Heading color="content.accent.default" variant="h3">
              Past Votes
            </Heading>
            {votesLoading ? (
              // Skeleton representation for loading state
              <Box display="flex" flexDirection="column" gap="20px" mt="16px">
                <Skeleton height="60px" width="100%" />
                <Skeleton height="60px" width="90%" />
                <Skeleton height="60px" width="80%" />
              </Box>
            ) : allVotes.length ? (
              <ListRow.Container mt="0">
                {allVotes.map((vote) => (
                  <Link
                    href={`/voting-proposals/${vote!.proposal}`}
                    key={vote!.id}
                    _hover={{ textDecoration: "none" }} // disable underline on hover for the Link itself
                  >
                    <ListRow.Root>
                      <ListRow.PastVotes
                        title={findProposalTitleByVote(vote.proposal)}
                        votePreference={
                          vote!.choice === 1
                            ? "for"
                            : vote.choice === 2
                            ? "against"
                            : "abstain"
                        }
                        voteCount={vote!.vp}
                        // body={vote?.proposal?.body}
                        body={vote?.reason}
                      />
                    </ListRow.Root>
                  </Link>
                ))}
              </ListRow.Container>
            ) : (
              <Box mt="standard.md">
                <EmptyState type="votesCast" title="No votes yet" />
              </Box>
            )}
          </Box>

          <Box mt="24px" mb={10}>
            <Heading mb="24px" color="content.accent.default" variant="h3">
              Comments
            </Heading>
            {delegateCommentsResponse?.isLoading ? (
              // Skeleton representation for loading state
              <Box display="flex" flexDirection="column" gap="20px">
                <Skeleton height="60px" width="100%" />
                <Skeleton height="60px" width="90%" />
                <Skeleton height="60px" width="80%" />
              </Box>
            ) : comments.length ? (
              <ListRow.Container mt="-20px">
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
                          date={comment?.createdAt as string}
                        />
                      </ListRow.Root>
                    </Link>
                  );
                })}
              </ListRow.Container>
            ) : (
              <EmptyState type="comments" title="No comments yet" />
            )}
          </Box>
        </Stack>
      </ProfilePageLayout.About>
    </ProfilePageLayout.Root>
  );
}

export const documentProps = {
  title: "Delegates / profile",
  image: "/social/social-delegates.png",
} satisfies DocumentProps;
