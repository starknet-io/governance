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
import Socials from "../../../components/SocialLogin";
import { useHelpMessage } from "src/hooks/HelpMessage";
import { useVotes } from "../../../hooks/snapshotX/useVotes";
import { useVotingPower } from "../../../hooks/snapshotX/useVotingPower";
import { useProposals } from "../../../hooks/snapshotX/useProposals";
import { useStarknetBalance } from "../../../hooks/starknet/useStarknetBalance";
import { useStarknetDelegates } from "../../../hooks/starknet/useStarknetDelegates";
import { useWallets } from "../../../hooks/useWallets";
import { useStarknetDelegate } from "../../../hooks/starknet/useStarknetDelegation";
import { delegationAgreement } from "src/utils/data";

const DELEGATION_SUCCESS_EVENT = "delegationSuccess";

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
  const { ethWallet, starknetWallet } = useWallets();
  const { primaryWallet, setPrimaryWallet } = useDynamicContext();

  const delegateId = pageContext.routeParams!.id;

  const delegateResponse = trpc.delegates.getDelegateById.useQuery({
    id: delegateId,
  });

  const delegateCommentsResponse = trpc.delegates.getDelegateComments.useQuery({
    delegateId,
  });

  const delegate = delegateResponse.data;
  const delegateAddress = delegate?.author?.address as `0x${string}`;
  const starknetAddress = delegate?.author?.starknetAddress as `0x${string}`;

  const {
    delegate: delegateL2,
    loading: isDelegationL2Loading,
    error: delegationL2Error,
    success: isDelegationL2Success,
  } = useStarknetDelegate();

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
    if (isDelegationL2Loading && dynamicUser) {
      setIsStatusModalOpen(true);
      setStatusTitle(
        hasUserDelegatedTokensToThisDelegate
          ? "Undelegating your votes"
          : "Delegating your votes",
      );
      setStatusDescription("");
    }
    if (delegationL2Error && dynamicUser) {
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
    if (isDelegationL2Success && dynamicUser) {
      setIsStatusModalOpen(true);
      setStatusTitle(
        isUndelegation
          ? "Votes undelegated successfully"
          : "Votes delegated successfully",
      );
      setStatusDescription("");
      setIsUndelegation(false);
    }
  }, [isDelegationL2Success, delegationL2Error, isDelegationL2Loading]);

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

  const delegationDataL1 = delegation?.data;

  const { delegates: delegationDataL2, loading: isLoadingL2Delegation } =
    useStarknetDelegates({
      starknetAddress: starknetWallet?.address,
    });

  const hasDelegatedOnL2 =
    delegationDataL2 &&
    delegationDataL2.length &&
    delegationDataL2.toLowerCase() ===
      delegate?.author?.starknetAddress?.toLowerCase();
  const hasDelegatedOnL1 =
    delegationDataL1 &&
    delegationDataL1.length &&
    delegationDataL1.toLowerCase() ===
      delegate?.author?.address?.toLowerCase() &&
    delegationDataL1 !== "0x0000000000000000000000000000000000000000";

  const {
    isLoading: isLoadingUndelegation,
    writeAsync: writeAsyncUndelegation,
  } = useL1StarknetDelegationDelegate({
    address: import.meta.env.VITE_APP_STARKNET_REGISTRY,
  });

  const { data: votesData, loading: votesLoading } = useVotes({
    voter: delegateAddress,
    skipField: "voter",
  });

  const { data: votingPower, isLoading: isLoadingVotingPower } = useVotingPower(
    {
      address: delegateAddress,
    },
  );

  const { data: votingPowerL2, isLoading: isLoadingVotingPowerL2 } =
    useVotingPower({
      address: starknetAddress,
    });

  const gqlResponseProposalsByUser = useProposals();

  const proposals = gqlResponseProposalsByUser?.data || [];

  const findProposalTitleByVote = (proposalId) =>
    proposals?.find((proposal) => proposal.id === proposalId)?.title || "";

  const senderData = useBalanceData(address);
  const receiverData = useBalanceData(delegateAddress);
  const senderDataL2 = useStarknetBalance({
    starknetAddress: starknetWallet?.address,
  });
  const receiverDataL2 = useStarknetBalance({
    starknetAddress: starknetAddress,
  });

  const allVotes = votesData?.votes || [];

  const isL1Delegation = primaryWallet?.id === ethWallet?.id;
  const isL2Delegation = primaryWallet?.id === starknetWallet?.id;

  const stats = allVotes.reduce((acc: { [key: string]: number }, vote) => {
    acc[vote!.choice] = (acc[vote!.choice] || 0) + 1;
    return acc;
  }, {});

  const renderAgreementValue = () => {
    if (delegate?.confirmDelegateAgreement) {
      return (
        <Flex gap={1}>
          <Text variant="small" fontWeight="600" color="content.accent.default">
            Yes -
          </Text>
          <Button
            top="-1px"
            left="-6px"
            variant="textSmall"
            onClick={() => setShowAgreement(true)}
            sx={{
              fontWeight: 600,
            }}
          >
            View
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="wrapper">
                <path
                  id="Union"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.8394 3.33352C5.4252 3.33059 5.08705 3.66401 5.08413 4.07821C5.08121 4.49241 5.41462 4.83056 5.82883 4.83348L8.09086 4.84943L3.58295 9.35733C3.29006 9.65023 3.29006 10.1251 3.58295 10.418C3.87584 10.7109 4.35072 10.7109 4.64361 10.418L9.1512 5.91041L9.16747 8.17222C9.17045 8.58643 9.50864 8.91979 9.92284 8.91681C10.337 8.91383 10.6704 8.57564 10.6674 8.16144L10.6383 4.10668C10.6353 3.69665 10.3036 3.36499 9.89357 3.3621L5.8394 3.33352Z"
                  fill="#1A1523"
                />
              </g>
            </svg>
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
  const isLoadingGqlResponse = isLoadingVotingPower || isLoadingVotingPowerL2;
  const hasUserDelegatedTokensToThisDelegate =
    delegation.isFetched &&
    delegation.data?.toLowerCase() === delegateAddress?.toLowerCase();

  const delegateOwnProfile =
    delegateAddress &&
    delegateAddress?.toLowerCase() === address?.toLowerCase();
  const [helpMessage, setHelpMessage] = useHelpMessage();

  const showNoVotingPowerMessaging = () => {
    setIsStatusModalOpen(true);
    setStatusTitle("No voting power");
    setStatusDescription(
      `You do not have enough tokens in your account to delegate. You need at least ${MINIMUM_TOKENS_FOR_DELEGATION} token to delegate.`,
    );
    setIsOpen(false);
    return;
  };

  const handleDelegation = async ({
    layer,
    isDelegation,
    isUndelegation,
  }: {
    layer?: 1 | 2 | null;
    isDelegation?: boolean;
    isUndelegation?: boolean;
  }) => {
    if (layer === 1) {
      if (isDelegation || (!isDelegation && !isUndelegation)) {
        if (
          parseFloat(senderData?.balance) < MINIMUM_TOKENS_FOR_DELEGATION &&
          !hasDelegatedOnL1
        ) {
          showNoVotingPowerMessaging();
          return;
        }
        setIsUndelegation(false);
        await setPrimaryWallet(ethWallet?.id);
        setIsOpen(true);
      } else if (isUndelegation && hasDelegatedOnL1) {
        await setPrimaryWallet(ethWallet?.id);
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
    } else if (layer === 2) {
      if (isDelegation) {
        if (
          parseFloat(senderDataL2?.balance?.balance) <
            MINIMUM_TOKENS_FOR_DELEGATION &&
          !hasDelegatedOnL2
        ) {
          showNoVotingPowerMessaging();
          return;
        }
        setIsUndelegation(false);
        setIsOpen(true);
        await setPrimaryWallet(starknetWallet?.id);
      } else if (isUndelegation) {
        await setPrimaryWallet(starknetWallet?.id);
        setIsUndelegation(true);
        delegateL2(starknetWallet.address!, "0x0")
          .then(() => {
            if (typeof window !== "undefined") {
              window.dispatchEvent(new Event(DELEGATION_SUCCESS_EVENT));
            }
            setIsUndelegation(false);
          })
          .catch((err) => {
            setIsStatusModalOpen(true);
            setStatusTitle("Undelegating voting power failed");
            setStatusDescription(
              err.shortMessage ||
                err.message ||
                err.name ||
                "An error occurred",
            );
            setIsUndelegation(false);
          });
      }
    } else {
      setIsOpen(true);
    }
  };

  return (
    <ProfilePageLayout.Root>
      <DelegateModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isConnected={primaryWallet !== null}
        isLayer2Delegation={primaryWallet?.id === starknetWallet?.id}
        isLayer1Delegation={primaryWallet?.id === ethWallet?.id}
        isUndelegation={isUndelegation}
        senderData={senderData}
        senderDataL2={senderDataL2?.balance}
        handleWalletSelect={async (address) => {
          if (address === starknetWallet?.address) {
            await setPrimaryWallet(starknetWallet?.id);
          } else {
            await setPrimaryWallet(ethWallet?.id);
          }
        }}
        receiverData={{
          ...receiverData,
          vp: votingPower,
        }}
        receiverDataL2={{
          ...receiverDataL2?.balance,
          vp: votingPowerL2,
        }}
        activeAddress={primaryWallet?.address}
        delegateTokens={() => {
          const l1Balance = senderData?.balance;
          const l2Balance = senderDataL2?.balance?.rawBalance;
          const isEligibleL1 =
            parseFloat(l1Balance) > MINIMUM_TOKENS_FOR_DELEGATION &&
            isL1Delegation;
          const isEligibleL2 =
            parseFloat(l2Balance) > MINIMUM_TOKENS_FOR_DELEGATION &&
            isL2Delegation;
          if (!isEligibleL2 && !isEligibleL1) {
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
            if (isL1Delegation) {
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
            } else if (isL2Delegation) {
              delegateL2(starknetWallet.address!, starknetAddress!)
                .then(() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new Event(DELEGATION_SUCCESS_EVENT));
                  }
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
            }
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
        isPending={
          (isDelegationLoading && isL1Delegation) ||
          (isDelegationL2Loading && isL2Delegation)
        }
        isSuccess={
          (isDelegationSuccess && isL1Delegation) ||
          (isDelegationL2Success && isL2Delegation)
        }
        isFail={
          (isDelegationError && isL1Delegation) ||
          (delegationL2Error && isL2Delegation) ||
          (isL1Delegation &&
            !!((!txHash || !txHash.length) && statusDescription?.length))
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
              status={delegate?.status}
              delegateProfile={true}
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

        {user && hasDelegatedOnL1 && !hasDelegatedOnL2 && (
          <>
            <Button
              variant="secondary"
              mt={{ base: "standard.2xl" }}
              mb="0"
              width={{ base: "100%" }}
              onClick={() =>
                handleDelegation({ layer: 1, isUndelegation: true })
              }
            >
              Undelegate on L1
            </Button>
            {starknetWallet && (
              <Button
                variant="primary"
                mt={{ base: "standard.md" }}
                mb="0"
                width={{ base: "100%" }}
                onClick={() =>
                  handleDelegation({ layer: 2, isDelegation: true })
                }
              >
                Delegate on L2
              </Button>
            )}
          </>
        )}
        {user && !hasDelegatedOnL1 && hasDelegatedOnL2 && (
          <>
            <Button
              variant="secondary"
              mt={{ base: "standard.2xl" }}
              mb="0"
              width={{ base: "100%" }}
              onClick={() =>
                handleDelegation({ layer: 2, isUndelegation: true })
              }
            >
              Undelegate on L2
            </Button>
            {ethWallet && (
              <Button
                variant="primary"
                mt={{ base: "standard.md" }}
                mb="0"
                width={{ base: "100%" }}
                onClick={() =>
                  handleDelegation({ layer: 1, isDelegation: true })
                }
              >
                Delegate on L1
              </Button>
            )}
          </>
        )}
        {user && !hasDelegatedOnL1 && !hasDelegatedOnL2 && (
          <>
            <Button
              variant="primary"
              mt={{ base: "standard.2xl" }}
              mb="0"
              width={{ base: "100%" }}
              onClick={() => handleDelegation({ layer: null })}
            >
              Delegate
            </Button>
          </>
        )}

        {user && hasDelegatedOnL1 && hasDelegatedOnL2 && (
          <>
            <Button
              variant="secondary"
              mt={{ base: "standard.2xl" }}
              mb="0"
              width={{ base: "100%" }}
              onClick={() =>
                handleDelegation({ layer: 1, isUndelegation: true })
              }
            >
              Undelegate on L1
            </Button>
            <Button
              variant="secondary"
              mt={{ base: "standard.md" }}
              mb="0"
              width={{ base: "100%" }}
              onClick={() =>
                handleDelegation({ layer: 2, isUndelegation: true })
              }
            >
              Undelegate on L2
            </Button>
          </>
        )}

        {!user && (
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
        )}

        {hasDelegatedOnL1 && (
          <Box mt="standard.md">
            <Banner
              label={`Your voting power of ${senderData.balance} ${senderData.symbol} is currently assigned to this delegate.`}
            />
          </Box>
        )}
        {hasDelegatedOnL2 && (
          <Box mt="standard.md">
            <Banner
              label={`Your voting power of ${senderDataL2.balance?.balance} ${senderDataL2?.balance?.symbol} is currently assigned to this delegate.`}
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
              label="Votes breakdown"
              value={
                stats ? (
                  <Flex
                    justifyContent="space-between"
                    flexDirection="row"
                    width="100%"
                  >
                    <Flex
                      gap="standard.base"
                      flexDirection="row"
                      alignItems="center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.58333 2.16699C8.30249 2.16699 7.5721 3.17908 7.24585 3.83158C7.00468 4.31392 6.674 5.31655 6.41956 6.13075C6.29802 6.51967 6.18784 6.88568 6.10447 7.16693H3.69792C2.62211 7.16693 1.75 8.03904 1.75 9.11484V16.3023C1.75 17.3782 2.62211 18.2503 3.69792 18.2503H14.7384C16.1819 18.2503 17.4402 17.2678 17.7903 15.8674L18.9882 11.0757C19.2232 10.1359 19.012 9.14032 18.4159 8.37678C17.8197 7.61323 16.905 7.16693 15.9363 7.16693H12.8333V5.4387C12.8333 4.50323 12.2328 3.68614 11.651 3.156C11.3447 2.87686 11.0032 2.63889 10.6654 2.46715C10.3418 2.30264 9.95913 2.16699 9.58333 2.16699ZM5.91666 8.66693H3.69792C3.45054 8.66693 3.25 8.86747 3.25 9.11484V16.3023C3.25 16.5497 3.45054 16.7503 3.69792 16.7503H5.91666V8.66693ZM7.41666 16.7503H14.7384C15.4936 16.7503 16.1519 16.2363 16.3351 15.5036L17.533 10.7119C17.6559 10.2203 17.5455 9.69936 17.2336 9.29989C16.9217 8.90042 16.4431 8.66693 15.9363 8.66693H12.0833C11.6691 8.66693 11.3333 8.33114 11.3333 7.91693V7.91591V5.4387C11.3333 5.12754 11.1006 4.68379 10.6407 4.26473C10.4262 4.06927 10.1947 3.91055 9.98562 3.80426C9.76232 3.69073 9.62421 3.66699 9.58333 3.66699C9.19751 3.66699 8.84956 3.97826 8.58749 4.5024C8.41199 4.8534 8.11767 5.72574 7.85128 6.57817C7.72256 6.99004 7.60655 7.37673 7.52265 7.6607C7.48073 7.80257 7.4469 7.91854 7.42361 7.99887L7.41666 8.02292V16.7503Z"
                          fill="#4A4A4F"
                        />
                      </svg>
                      <Text variant="small" color="content.accent.default">
                        {stats[1] ?? 0}
                      </Text>
                    </Flex>
                    <Flex
                      gap="standard.base"
                      flexDirection="row"
                      alignItems="center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6.09573 1.75C4.65221 1.75 3.39393 2.73244 3.04382 4.13286L1.84591 8.92452C1.61096 9.86431 1.82209 10.8599 2.41825 11.6235C3.01441 12.387 3.9291 12.8333 4.89782 12.8333H8.0008V14.5616C8.0008 16.1287 8.99682 17.5227 10.4795 18.0304L10.8045 18.1417C11.3084 18.3143 11.8604 18.2788 12.338 18.0429C12.8156 17.807 13.1794 17.3904 13.3488 16.8853L14.7071 12.8333H17.1362C18.212 12.8333 19.0841 11.9612 19.0841 10.8854V3.69792C19.0841 2.62211 18.212 1.75 17.1362 1.75H14.1675H6.09573ZM13.4175 3.25H6.09573C5.34051 3.25 4.68221 3.76399 4.49904 4.49666L3.30112 9.28833C3.1782 9.78001 3.28866 10.3009 3.60056 10.7004C3.91246 11.0998 4.39101 11.3333 4.89782 11.3333H8.7508C9.16501 11.3333 9.5008 11.6691 9.5008 12.0833V12.0844V14.5616C9.5008 15.4876 10.0894 16.3113 10.9655 16.6114L10.9655 16.6114L11.2905 16.7227C11.4165 16.7658 11.5544 16.7569 11.6739 16.6979C11.7933 16.639 11.8842 16.5348 11.9265 16.4085L13.4175 11.9609V3.25ZM14.9175 11.3333V3.25H17.1362C17.3836 3.25 17.5841 3.45054 17.5841 3.69792V10.8854C17.5841 11.1328 17.3836 11.3333 17.1362 11.3333H14.9175Z"
                          fill="#4A4A4F"
                        />
                      </svg>
                      <Text variant="small" color="content.accent.default">
                        {stats[2] ?? 0}
                      </Text>
                    </Flex>
                    <Flex
                      gap="standard.base"
                      flexDirection="row"
                      alignItems="center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10 1.75C5.44995 1.75 1.75 5.44995 1.75 10C1.75 14.55 5.44995 18.25 10 18.25C14.5501 18.25 18.25 14.5492 18.25 10C18.25 5.45079 14.5492 1.75 10 1.75ZM3.25 10C3.25 6.27838 6.27838 3.25 10 3.25C13.7208 3.25 16.75 6.27921 16.75 10C16.75 13.7208 13.7216 16.75 10 16.75C6.27838 16.75 3.25 13.7216 3.25 10ZM7.5 11.75C7.08579 11.75 6.75 12.0858 6.75 12.5C6.75 12.9142 7.08579 13.25 7.5 13.25H12.5C12.9142 13.25 13.25 12.9142 13.25 12.5C13.25 12.0858 12.9142 11.75 12.5 11.75H7.5ZM7.08333 6.75C7.49755 6.75 7.83333 7.08579 7.83333 7.5V8.33333C7.83333 8.74755 7.49755 9.08333 7.08333 9.08333C6.66912 9.08333 6.33333 8.74755 6.33333 8.33333V7.5C6.33333 7.08579 6.66912 6.75 7.08333 6.75ZM13.6667 7.5C13.6667 7.08579 13.3309 6.75 12.9167 6.75C12.5025 6.75 12.1667 7.08579 12.1667 7.5V8.33333C12.1667 8.74755 12.5025 9.08333 12.9167 9.08333C13.3309 9.08333 13.6667 8.74755 13.6667 8.33333V7.5Z"
                          fill="#4A4A4F"
                        />
                      </svg>
                      <Text variant="small" color="content.accent.default">
                        {stats[3] ?? 0}
                      </Text>
                    </Flex>
                  </Flex>
                ) : (
                  "0/0/0"
                )
              }
            />
            <SummaryItems.Item
              isLoading={!delegateCommentsResponse.isFetched}
              label="Total comments"
              value={delegateCommentsResponse.data?.length.toString() || "0"}
            />
            <Divider />
            {/* <SummaryItems.Item
              isLoading={isLoadingGqlResponse}
              label="Delegated votes"
              value={(gqlResponse.data || 0).toLocaleString()}
            /> */}
            <SummaryItems.Item
              isLoading={!delegateResponse.isFetched}
              isCopiable={!!delegate?.author?.starknetAddress}
              isTruncated={!!delegate?.author?.starknetAddress}
              label="Starknet address"
              value={delegate?.author?.starknetAddress || "None"}
              additionalValue={votingPowerL2?.toString() || "0"}
              isExtendable={true}
            />
            <SummaryItems.Item
              isLoading={!delegateResponse.isFetched}
              isCopiable={!!delegate?.author?.address}
              isTruncated={!!delegate?.author?.address}
              label="Ethereum address"
              value={delegate?.author?.address || "None"}
              additionalValue={votingPower?.toString() || "0"}
              isExtendable={true}
            />
            <SummaryItems.Item
              label="Delegation agreement"
              value={renderAgreementValue()}
            />
          </SummaryItems.Root>
          <Divider mt="standard.sm" mb="standard.sm" />
          <Socials
            delegateId={delegateId}
            socials={{
              twitter: delegate?.twitter,
              discord: delegate?.discord,
              discourse: delegate?.discourse,
              telegram: delegate?.telegram,
            }}
          />
          <Divider mt="standard.sm" mb="standard.sm" />
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
        </Box>
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
