import { DocumentProps } from "src/renderer/types";

import {
  Box,
  ContentContainer,
  Divider,
  Heading,
  ListRow,
  ProfileSummaryCard,
  QuillEditor,
  Stack,
  SummaryItems,
  Text,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { useEffect } from "react";
import { Delegate } from "@yukilabs/governance-backend/src/db/schema/delegates";
import { useDynamicContext } from "@dynamic-labs/sdk-react";

export function Page() {
  useEffect(() => {
    const currentUrl = window.location.href;
    const profileId = extractProfileId(currentUrl);
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
      return trpc.delegates.getDelegateById.useQuery({
        id: profileId,
      });
    }
    return undefined;
  };

  const delegateResponse = typeof window !== "undefined" ? getDelegate() : null;

  const delegate: Delegate | null =
    delegateResponse?.data?.map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    }))[0] || null;

  const { user: DynamicUser } = useDynamicContext();
  // console.log(DynamicUser);
  // temp eth address
  const fakeEthAddress = `${delegate?.starknetWalletAddress?.slice(0, 5)}.eth`;
  console.log(delegate);
  return (
    <Box
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      flex="1"
      height="100%"
    >
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
          <ProfileSummaryCard.PrimaryButton
            label="Delegate your votes"
            onClick={() => console.log("red")}
          />
        </ProfileSummaryCard.Root>

        <SummaryItems.Root>
          <SummaryItems.Title label="Stats" />
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
        <Divider />
        <SummaryItems.Root direction="row">
          <SummaryItems.Title label="Social" />
          <SummaryItems.Socials label="twitter" value={delegate?.twitter} />
          <SummaryItems.Socials label="discourse" value={delegate?.discourse} />
          <SummaryItems.Socials label="discord" value={delegate?.discord} />
          {/* <SummaryItems.Socials label="telegram" value="@cillianh" />
          <SummaryItems.Socials label="github" value="@cillianh" /> */}
        </SummaryItems.Root>
        <Divider />
        <SummaryItems.Root>
          <SummaryItems.Title label="Expertise" />
          <SummaryItems.Tags type={delegate?.delegateType} />
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
