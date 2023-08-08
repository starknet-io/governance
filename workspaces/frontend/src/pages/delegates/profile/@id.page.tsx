/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DocumentProps } from "src/renderer/types";

import {
  Box,
  ConfirmModal,
  ContentContainer,
  DelegateModal,
  Divider,
  Flex,
  Heading,
  MarkdownRenderer,
  ProfileSummaryCard,
  Stack,
  SummaryItems,
  MenuItem,
  Status,
  EmptyState,
  AgreementModal,
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
  const [showAgreement, setShowAgreement] = useState<boolean>(false);
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

  console.log(delegate)

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
      <AgreementModal
        isOpen={showAgreement}
        onClose={() => setShowAgreement(false)}
        content={
          delegate?.customAgreement
            ? delegate!.customAgreement!.content
            : mockAgreement
        }
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
              value={renderAgreementValue()}
            />
            <SummaryItems.Item
              isCopiable
              isTruncated
              label="Starknet address"
              value={delegate?.author?.starknetAddress ?? ""}
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
          <MarkdownRenderer content={delegate?.delegateStatement || ""} />
          <Box mt="24px">
            <Heading mb="24px" color="#33333E" variant="h3">
              Past Votes
            </Heading>
            {/* // ToDo: add past votes */}
            {/* <ListRow.Container>
              <ListRow.Root>
                <ListRow.PastVotes />
                <ListRow.Comments count={3} />
              </ListRow.Root>
              <ListRow.Root>
                <ListRow.PastVotes />
                <ListRow.Comments count={3} />
              </ListRow.Root>
            </ListRow.Container> */}
            <EmptyState type="votes" title="No past votes" />
          </Box>
          <Box mt="24px">
            <Heading mb="24px" color="#33333E" variant="h3">
              Post comments
            </Heading>
            {/* // ToDo: add post comments */}
            {/* <ListRow.Container>
              <ListRow.Root>
                <ListRow.CommentSummary />
                <ListRow.Comments count={3} />
              </ListRow.Root>
              <ListRow.Root>
                <ListRow.CommentSummary />
                <ListRow.Comments count={3} />
              </ListRow.Root>
            </ListRow.Container> */}
            <EmptyState type="posts" title="No post comments" />
          </Box>
        </Stack>
      </ContentContainer>
    </Box>
  );
}

export const documentProps = {
  title: "Delegates / profile",
} satisfies DocumentProps;
