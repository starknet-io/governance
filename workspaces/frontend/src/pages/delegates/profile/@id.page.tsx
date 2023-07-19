/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DocumentProps } from "src/renderer/types";

import {
  Box,
  ConfirmModal,
  ContentContainer,
  DelegateModal,
  Divider,
  Heading,
  ListRow,
  // MarkdownRenderer,
  QuillEditor,
  ProfileSummaryCard,
  Stack,
  SummaryItems,
  MenuItem,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useState } from "react";
import { useAccount, useBalance, useEnsName } from "wagmi";
import { usePageContext } from "src/renderer/PageContextProvider";
import { useDelegateRegistrySetDelegate } from "src/wagmi/DelegateRegistry";
import { useQuery } from "@apollo/client";
import { gql } from "src/gql";

const GET_DELEGATE_STATS = gql(`
query Votes($where: VoteWhere) {
  votes(where: $where)  {
    id,
    choice
  }}`);

const useBalanceData = (address: `0x${string}` | undefined) => {
  const { data: balance } = useBalance({
    address,
    chainId: 5,
    token: "0x65aFADD39029741B3b8f0756952C74678c9cEC93", //USDC Goerli test token address
    // token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", //USDC Mainnet test token address
  });

  const { data: ensName } = useEnsName({
    address,
  });

  return {
    address,
    balance: balance?.formatted ?? "0",
    ethAddress: ensName ?? address,
    symbol: balance?.symbol ?? "USDC",
  };
};

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
    address: "0x469788fE6E9E9681C6ebF3bF78e7Fd26Fc015446",
  });

  const delegateResponse = trpc.delegates.getDelegateById.useQuery({
    id: pageContext.routeParams!.id,
  });

  const delegate = delegateResponse.data;

  const user = delegate?.author;

  const senderData = useBalanceData(address);

  const receiverData = useBalanceData(user?.address as `0x${string}`);

  const { data } = useQuery(GET_DELEGATE_STATS, {
    variables: {
      where: {
        space: "robwalsh.eth",
        voter: user?.address,
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
              user?.address as any,
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
            address={user?.address}
            avatarString={user?.address}
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
            <Heading color="#33333E" variant="h3">
              Past Votes
            </Heading>
            <ListRow.Container>
              <ListRow.Root>
                <ListRow.PastVotes />
                <ListRow.Comments count={3} />
              </ListRow.Root>
              <ListRow.Root>
                <ListRow.PastVotes />
                <ListRow.Comments count={3} />
              </ListRow.Root>
            </ListRow.Container>
          </Box>
          <Box mt="24px">
            <Heading color="#33333E" variant="h3">
              Comments
            </Heading>
            <ListRow.Container>
              <ListRow.Root>
                <ListRow.CommentSummary />
                <ListRow.Comments count={3} />
              </ListRow.Root>
              <ListRow.Root>
                <ListRow.CommentSummary />
                <ListRow.Comments count={3} />
              </ListRow.Root>
            </ListRow.Container>
          </Box>
        </Stack>
      </ContentContainer>
    </Box>
  );
}

export const documentProps = {
  title: "Delegates / profile",
} satisfies DocumentProps;
