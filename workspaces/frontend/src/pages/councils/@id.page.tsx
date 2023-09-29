import { DocumentProps, ROLES } from "src/renderer/types";

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
  Link,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { usePageContext } from "src/renderer/PageContextProvider";
import { useEffect, useState } from "react";
import { MemberType } from "@yukilabs/governance-components/src/MembersList/MembersList";
import { navigate } from "vite-plugin-ssr/client/router";
import { gql } from "src/gql";
import { useQuery } from "@apollo/client";
import { hasPermission } from "src/utils/helpers";
import { Text } from "@chakra-ui/react";

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

export function Page() {
  const pageContext = usePageContext();
  const [members, setMembers] = useState<MemberType[]>([]);
  const councilResp = trpc.councils.getCouncilBySlug.useQuery({
    slug: pageContext.routeParams!.id,
  });

  const { data: council } = councilResp;
  const { user: loggedUser } = usePageContext();

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

  const gqlResponse = useQuery(DELEGATE_PROFILE_PAGE_QUERY, {
    variables: {
      space: import.meta.env.VITE_APP_SNAPSHOT_SPACE,
      voter: council?.address ?? "",
      where: {
        voter: council?.address,
        space: import.meta.env.VITE_APP_SNAPSHOT_SPACE,
      },
    },
    skip: council?.address == null,
  });

  const stats = gqlResponse.data?.votes?.reduce(
    (acc: { [key: string]: number }, vote) => {
      acc[vote!.choice] = (acc[vote!.choice] || 0) + 1;
      return acc;
    },
    {},
  );

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
            address={council?.address ?? ""}
            ensName={council?.name ?? "Council"}
          >
            {hasPermission(loggedUser?.role, [ROLES.ADMIN, ROLES.MODERATOR]) ? (
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

        <Divider my="standard.xl" />
        <Box>
          <Text
            variant="medium"
            mb="standard.xl"
            color="content.default.default"
          >
            {council?.description ? council?.description : ""}
          </Text>
          {hasPermission(loggedUser?.role, [ROLES.ADMIN, ROLES.MODERATOR]) ? (
            <Button variant="outline" onClick={handleClick} width="100%">
              Add new post
            </Button>
          ) : (
            <></>
          )}
        </Box>
        <Divider my="24px" />
        <SummaryItems.Root>
          <SummaryItems.Item
            label="Proposals voted on"
            value={gqlResponse.data?.votes?.length.toString() ?? "0"}
          />
          <SummaryItems.Item
            label="Delegated votes"
            value={gqlResponse.data?.vp?.vp?.toString() ?? "0"}
          />

          <SummaryItems.Item
            label="For/against/abstain"
            value={
              (stats && `${stats[1] ?? 0}/${stats[2] ?? 0}/${stats[3] ?? 0}`) ||
              "0/0/0"
            }
          />
        </SummaryItems.Root>
      </Box>

      <ContentContainer center maxWidth="800px">
        <Stack width="100%" spacing="0" direction={{ base: "column" }}>
          <Collapse startingHeight={100}>
            <Stack spacing="0" direction={{ base: "column" }}>
              <Heading
                lineHeight="32px"
                color="content.accent.default"
                variant="h3"
                mb="8px"
              >
                The role of the {council?.name ?? "Council"}
              </Heading>

              <MarkdownRenderer content={council?.statement || ""} />
              {members.length > 0 ? (
                <Box mb="standard.xs" mt="standard.2xl">
                  <Heading color="content.accent.default" variant="h3">
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
            <Heading variant="h3" color="content.accent.default">
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
            <Heading mb="24px" color="content.accent.default" variant="h3">
              Past Votes
            </Heading>
            {gqlResponse.data?.votes?.length ? (
              <ListRow.Container>
                {gqlResponse.data?.votes.map((vote) => (
                  <Link
                    href={`/voting-proposals/${vote!.proposal!.id}`}
                    key={vote!.id}
                    _hover={{ textDecoration: "none" }}
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
        </Stack>
      </ContentContainer>
    </Box>
  );
}

export const documentProps = {
  title: "Council",
} satisfies DocumentProps;
