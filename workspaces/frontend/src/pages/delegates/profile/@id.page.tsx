/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DocumentProps } from "src/renderer/types";

import {
  Box,
  ConfirmModal,
  ContentContainer,
  DelegateModal,
  Divider,
  Heading,
  // ListRow,
  // MarkdownRenderer,
  QuillEditor,
  ProfileSummaryCard,
  Stack,
  SummaryItems,
  MenuItem,
  Status,
  EmptyState,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useState } from "react";
import { useAccount } from "wagmi";
import { usePageContext } from "src/renderer/PageContextProvider";
import { useDelegateRegistryDelegation, useDelegateRegistrySetDelegate } from "src/wagmi/DelegateRegistry";
import { useQuery } from "@apollo/client";
import { gql } from "src/gql";
import { useBalanceData } from "src/utils/hooks";

const GET_DELEGATE_STATS = gql(`
query Votes($where: VoteWhere) {
  votes(where: $where)  {
    id,
    choice
  }}`);


function getChoiceStats(data: any[]) {
  const stats: { [key: string]: number } = { 1: 0, 2: 0, 3: 0 };
  data?.forEach((vote) => {
    if (vote.choice in stats) {
      stats[vote.choice] += 1;
    } else {
      stats[vote.choice] = 1;
    }
  });

  return stats;
}

export function Page() {
  const pageContext = usePageContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { address, isConnected } = useAccount();

  const { isLoading, write } = useDelegateRegistrySetDelegate({
    address: import.meta.env.VITE_APP_DELEGATION_REGISTRY,
    chainId: parseInt(import.meta.env.VITE_APP_DELEGATION_CHAIN_ID)
  });

  const delegation = useDelegateRegistryDelegation({
    address: import.meta.env.VITE_APP_DELEGATION_REGISTRY,
    args: [
      address!,
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    ],
    watch: true,
    chainId: parseInt(import.meta.env.VITE_APP_DELEGATION_CHAIN_ID),
    enabled: address != null
  })

  const delegateId = pageContext.routeParams!.id

  const delegateResponse = trpc.delegates.getDelegateById.useQuery({
    id: delegateId,
  });

  const delegate = delegateResponse.data;
  const delegateAddress = delegate?.author?.address as `0x${string}`

  const senderData = useBalanceData(address);
  const receiverData = useBalanceData(delegateAddress);

  const { data } = useQuery(GET_DELEGATE_STATS, {
    variables: {
      where: {
        space: import.meta.env.VITE_APP_SNAPSHOT_SPACE,
        voter: delegate?.author?.address,
      },
    },
  });
  const stats = getChoiceStats(data?.votes as any[]);
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
              "0x0000000000000000000000000000000000000000000000000000000000000000",
              delegate?.author?.address as any,
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
            address={delegate?.author?.ensName || delegate?.author?.address}
            avatarString={delegate?.author?.ensAvatar || delegate?.author?.address}
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
          {delegation.isFetched &&
            delegation.data === delegateAddress &&
            <Status label={`Your voting power of ${senderData.balance} ${senderData.symbol} is currently assigned to this delegate.`} />
          }

          {delegateResponse.isFetched && address === delegateAddress &&
            <Status label="You can’t delegate votes to your own account." />
          }
        </Box>

        <Box mt="32px">
          <SummaryItems.Root>
            <SummaryItems.Item
              label="Proposals voted on"
              value={`${data?.votes?.length}`}
            />
            <SummaryItems.Item label="Delegated votes" value="0" />
            <SummaryItems.Item label="Total comments" value="0" />
            <SummaryItems.Item
              label="For/against/abstain"
              value={`${stats[1]}/${stats[2]}/${stats[3]}`}
            />
            <SummaryItems.Item
              label="Delegation agreement"
              value={delegate?.agreeTerms ? "Yes" : "No"}
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
