import { DocumentProps } from "src/renderer/types";

import {
  Box,
  SummaryItems,
  Divider,
  ContentContainer,
  Stack,
  Heading,
  ListRow,
  ProfileSummaryCard,
  Collapse,
  // MarkdownRenderer,
  QuillEditor,
  MembersList,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { usePageContext } from "src/renderer/PageContextProvider";
import { useEffect, useState } from "react";
import { MemberType } from "@yukilabs/governance-components/src/MembersList/MembersList";

export function Page() {
  const pageContext = usePageContext();
  const [members, setMembers] = useState<MemberType[]>([]);
  const councilResp = trpc.councils.getCouncilBySlug.useQuery({
    slug: pageContext.routeParams!.id,
  });

  const { data: council } = councilResp;

  useEffect(() => {
    if (council) {
      const tempMembers = council.members?.map((member) => {
        return {
          address: member.user.address,
          name: member.user.name,
          twitterHandle: member.user.twitter,
          miniBio: member.user.miniBio,
        };
      });
      setMembers(tempMembers ?? []);
    }
  }, [council]);

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
            address="0x2EF324324234234234234234231234"
            ethAddress={council?.name ?? "Council"}
          >
            <ProfileSummaryCard.MoreActions
              onClick={() => console.log("red")}
            />
          </ProfileSummaryCard.Profile>
        </ProfileSummaryCard.Root>

        <Divider my="24px" />
        <Box>
          {/* <MarkdownRenderer content={council?.description || ""} /> */}
          <QuillEditor value={council?.description ?? ""} readOnly />
        </Box>
        <Divider my="24px" />
        <SummaryItems.Root>
          <SummaryItems.Item label="Proposals voted on" value="6" />
          <SummaryItems.Item label="Delegated votes" value="7,000,000" />

          <SummaryItems.Item label="For/against/abstain" value="2/0/4" />
        </SummaryItems.Root>
      </Box>

      <ContentContainer maxWidth="800px">
        <Stack spacing="24px" direction={{ base: "column" }} color="#545464">
          <Collapse startingHeight={100}>
            <Stack
              spacing="24px"
              direction={{ base: "column" }}
              color="#545464"
            >
              <Heading color="#33333E" variant="h3">
                The role of the {council?.name ?? "Council"}
              </Heading>

              {/* <MarkdownRenderer content={council?.statement || ""} /> */}
              <QuillEditor value={council?.statement ?? ""} readOnly />
              {members.length > 0 ? (
                <Box mb="24px">
                  <Heading color="#33333E" variant="h5">
                    Members
                  </Heading>
                  <MembersList
                    members={members}
                    setMembers={setMembers}
                    readonly
                  />
                </Box>
              ) : null}
            </Stack>
          </Collapse>

          <Box mt="24px">
            <Heading color="#33333E" variant="h3">
              Posts
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
        </Stack>
      </ContentContainer>
    </Box>
  );
}

export const documentProps = {
  title: "Councils / Builders",
} satisfies DocumentProps;
