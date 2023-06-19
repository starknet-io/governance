import { DocumentProps } from "src/renderer/types";

import {
  Box,
  ConfirmModal,
  ContentContainer,
  DelegateModal,
  Divider,
  Heading,
  ListRow,
  ProfileSummaryCard,
  QuillEditor,
  Stack,
  SummaryItems,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useEffect, useState } from "react";
import {
  Chain,
  useAccount,
  useBalance,
  useContractWrite,
  useEnsName,
  useNetwork,
} from "wagmi";
import abiJson from "src/utils/abiJson.json";

const abi = [...abiJson] as const;

const WagmiData = (
  address: `0x${string}` | undefined,
  chain: (Chain & { unsupported?: boolean | undefined }) | undefined
) => {
  const { data: balance } = useBalance({
    address,
    chainId: chain?.id,
    token: "0x65aFADD39029741B3b8f0756952C74678c9cEC93", //USDC Goerli test token address
  });
  const { data: ensName } = useEnsName({
    address,
  });

  return {
    address,
    balance: balance?.formatted ?? "0",
    ethAddress: ensName ?? address,
    symbol: balance?.symbol ?? "STRK",
  };
};

const id = "0x0000000000000000000000000000000000000000000000000000000000000000";

const useSetDelegateContractWrite = (userAddress?: string) => {
  const args = userAddress ? [id, userAddress] : undefined;

  const { write, isLoading } = useContractWrite({
    address: "0x469788fE6E9E9681C6ebF3bF78e7Fd26Fc015446",
    abi,
    functionName: "setDelegate",
    mode: "recklesslyUnprepared",
    args,
  });

  return { write, isLoading };
};

export function Page() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userAddress, setUserAddress] = useState<string | undefined>(undefined);
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  const { write, isLoading } = useSetDelegateContractWrite(userAddress);

  useEffect(() => {
    // const currentUrl = window.location.href;
    // const profileId = extractProfileId(currentUrl);
  }, []);

  const extractProfileId = (url: string): string | null => {
    const parts = url.split("/delegates/profile/");
    if (parts.length > 1) {
      const profileId = parts[1].split("/")[0];
      return profileId;
    }

    return null;
  };

  const getDelegate = () => {
    const profileId = extractProfileId(window.location.href);
    if (profileId) {
      return trpc.delegates.getDelegateById.useQuery(
        {
          id: profileId,
        },
        {
          onSuccess: (data) => {
            setUserAddress(data?.[0]?.users?.address);
          },
        }
      );
    }
    return undefined;
  };

  const delegateResponse = typeof window !== "undefined" ? getDelegate() : null;

  const delegate = delegateResponse?.data?.[0].delegates;

  const user = delegateResponse?.data?.[0].users;

  // temp eth address
  const fakeEthAddress = `${delegate?.starknetWalletAddress?.slice(0, 5)}.eth`;

  const senderData = WagmiData(address, chain);

  const receiverData = WagmiData(user?.address as `0x${string}`, chain);

  const transferTokens = (e?: any) => {
    e?.preventDefault();
    write?.();
    setIsOpen(false);
  };

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
        delegateTokens={() => transferTokens()}
      />
      <ConfirmModal isOpen={isLoading} onClose={() => setIsOpen(false)} />
      <Box
        pt="40px"
        px="32px"
        borderRight="1px solid #E7E8E9"
        display="flex"
        flexDirection="column"
        flexBasis={{ base: "100%", md: "391px" }}
        height="100%"
      >
        <ProfileSummaryCard.Root>
          <ProfileSummaryCard.Profile
            address={delegate?.starknetWalletAddress}
            ethAddress={fakeEthAddress}
            avatarString={delegate?.userId}
          >
            <ProfileSummaryCard.MoreActions
              onClick={() => console.log("red")}
            />
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

        <SummaryItems.Root>
          <SummaryItems.Item label="Proposals voted on" value="-" />
          <SummaryItems.Item label="Delegated votes" value="-" />
          <SummaryItems.Item label="Total comments" value="-" />
          <SummaryItems.Item label="For/against/abstain" value="-" />
          <SummaryItems.Item
            label="Delegation agreement"
            value={delegate?.agreeTerms ? "Yes" : "No"}
          />
          <SummaryItems.Item
            isTruncated
            label="Starknet address"
            value={delegate?.starknetWalletAddress}
          />
        </SummaryItems.Root>
        <Divider mt="32px" />
        <SummaryItems.Root direction="row">
          <SummaryItems.Socials label="twitter" value={delegate?.twitter} />
          <SummaryItems.Socials label="discourse" value={delegate?.discourse} />
          <SummaryItems.Socials label="discord" value={delegate?.discord} />
          {/* <SummaryItems.Socials label="telegram" value="@cillianh" />
          <SummaryItems.Socials label="github" value="@cillianh" /> */}
        </SummaryItems.Root>
        <Divider mt="32px" />
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

      <ContentContainer maxWidth="800">
        <Stack
          spacing="24px"
          direction={{ base: "column" }}
          color="#545464"
          width="100%"
        >
          <Heading color="#33333E" variant="h3">
            Delegate pitch
          </Heading>
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
