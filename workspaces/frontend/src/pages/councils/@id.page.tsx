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
  MarkdownRenderer,
  MembersList,
  Button,
  MenuItem,
  EmptyState,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { usePageContext } from "src/renderer/PageContextProvider";
import { useEffect, useState } from "react";
import { MemberType } from "@yukilabs/governance-components/src/MembersList/MembersList";
import { navigate } from "vite-plugin-ssr/client/router";
import { useDynamicContext } from "@dynamic-labs/sdk-react";

export function Page() {
  const pageContext = usePageContext();
  const [members, setMembers] = useState<MemberType[]>([]);
  const councilResp = trpc.councils.getCouncilBySlug.useQuery({
    slug: pageContext.routeParams!.id,
  });

  const { data: council } = councilResp;
  const { user } = useDynamicContext();

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

  const handleClick = (): void => {
    if (!council?.id) return;
    navigate(`/councils/posts/create?councilId=${council?.id.toString()}`);
  };

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
        position={{ base: "unset", lg: "sticky" }}
        height="calc(100vh - 80px)"
        top="0"
      >
        <ProfileSummaryCard.Root>
          <ProfileSummaryCard.Profile
            address="0x2EF324324234234234234234231234"
            ensName={council?.name ?? "Council"}
          >
            {user ? (
              <ProfileSummaryCard.MoreActions>
                <MenuItem as="a" href={`/councils/edit/${council?.slug}`}>
                  Edit
                </MenuItem>
                {/* <MenuItem>Delete</MenuItem> */}
              </ProfileSummaryCard.MoreActions>
            ) : (
              <></>
            )}
          </ProfileSummaryCard.Profile>
        </ProfileSummaryCard.Root>

        <Divider my="24px" />
        <Box>
          <MarkdownRenderer content={council?.description || ""} />
          {user ? (
            <Button mt="24px" variant="fullGhostBtn" onClick={handleClick}>
              Add new post
            </Button>
          ) : (
            <></>
          )}
        </Box>
        <Divider my="24px" />
        <SummaryItems.Root>
          <SummaryItems.Item label="Proposals voted on" value="0" />
          <SummaryItems.Item label="Delegated votes" value="0" />

          <SummaryItems.Item label="For/against/abstain" value="0/0/0" />
        </SummaryItems.Root>
      </Box>

      <ContentContainer center maxWidth="800px">
        <Stack
          width="100%"
          spacing="24px"
          direction={{ base: "column" }}
          color="#545464"
          paddingBottom="200px"
        >
          <Collapse startingHeight={100}>
            <Stack
              spacing="24px"
              direction={{ base: "column" }}
              color="#545464"
            >
              <Heading color="#33333E" variant="h3">
                The role of the {council?.name ?? "Council"}
              </Heading>

              <MarkdownRenderer content={council?.statement || ""} />
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
              {council?.posts && council.posts.length > 0 ? (
                council.posts.map((post) => {
                  return (
                    <Box
                      key={post.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <ListRow.Root href={`/councils/posts/${post.id}`}>
                        <Box width={"100%"}>
                          <ListRow.Post post={post} />
                        </Box>
                      </ListRow.Root>
                      <div style={{ marginLeft: "auto" }}>
                        <ListRow.Comments count={post.comments.length} />
                      </div>
                    </Box>
                  );
                })
              ) : (
                <EmptyState type="posts" title="No posts yet" />
              )}
            </ListRow.Container>
          </Box>
          <Box mt="24px">
            <Heading color="#33333E" variant="h3">
              Past Votes
            </Heading>
            <ListRow.Container>
              <EmptyState type="votes" title="No past votes" />
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
