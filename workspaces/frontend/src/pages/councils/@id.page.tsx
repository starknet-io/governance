import { DocumentProps, ROLES } from "src/renderer/types";

import {
  Box,
  SummaryItems,
  Divider,
  Stack,
  Heading,
  ListRow,
  Collapse,
  MarkdownRenderer,
  MembersList,
  Button,
  MenuItem,
  EmptyState,
  Link,
  AvatarWithText,
  Skeleton,
  SkeletonCircle,
} from "@yukilabs/governance-components";
import { trpc } from "src/utils/trpc";
import { usePageContext } from "src/renderer/PageContextProvider";
import { useEffect, useState } from "react";
import { MemberType } from "@yukilabs/governance-components/src/MembersList/MembersList";
import { navigate } from "vite-plugin-ssr/client/router";
import { hasPermission } from "src/utils/helpers";
import { Flex, Text } from "@chakra-ui/react";
import { truncateAddress } from "@yukilabs/governance-components/src/utils";
import * as ProfilePageLayout from "../../components/ProfilePageLayout/ProfilePageLayout";
import { useVotes } from "../../hooks/snapshotX/useVotes";
import { useVotingPower } from "../../hooks/snapshotX/useVotingPower";
import { useProposals } from "../../hooks/snapshotX/useProposals";

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
          address: member.address,
          name: member.name,
          twitterHandle: member.twitter,
          miniBio: member.miniBio,
        };
      });
      setMembers(tempMembers ?? []);
    }
  }, [council]);

  const handleClick = (): void => {
    if (!council?.id) return;
    navigate(`/councils/posts/create?councilId=${council?.id.toString()}`);
  };

  const gqlResponseProposals = useProposals();

  const proposals = gqlResponseProposals?.data || [];

  const findProposalTitleByVote = (proposalId) =>
    proposals?.find((proposal) => proposal.id === proposalId)?.title || "";
  const findProposalBodyByVote = (proposalId) =>
    proposals?.find((proposal) => proposal.id === proposalId)?.body || "";

  const { data: votingPower, isLoading: isVotingPowerLoading } = useVotingPower(
    {
      address: council?.address?.toLowerCase(),
    },
  );

  const {
    data: votesData,
    loading: isVotesLoading,
    error: isVotesError,
  } = useVotes({
    voter: council?.address?.toLowerCase() ?? "",
    skipField: "voter",
  });

  const stats = votesData?.votes?.reduce(
    (acc: { [key: string]: number }, vote) => {
      acc[vote!.choice] = (acc[vote!.choice] || 0) + 1;
      return acc;
    },
    {},
  );

  const isCouncilLoading = !council;

  const isLoadingGqlResponse = isVotingPowerLoading;

  const councilAddress = council?.address?.toLowerCase() ?? "";

  return (
    <ProfilePageLayout.Root>
      <ProfilePageLayout.Profile>
        {isCouncilLoading ? (
          <Box display="flex" flexDirection="column" gap="12px" mb="18px">
            <Flex gap="20px" alignItems="center">
              {/* Avatar or Indenticon */}
              <SkeletonCircle size="64px" />

              <Flex flex="1" direction="column">
                {/* Header Text */}
                <Skeleton height="24px" width="70%" mb="4px" />

                {/* Subheader Text */}
                <Skeleton height="16px" width="50%" />
                <Skeleton height="16px" width="50%" />
              </Flex>

              {/* Dropdown Skeleton */}
            </Flex>
            <Skeleton height="24px" width="100%" borderRadius="md" />
            <Skeleton height="16px" width="50%" />
            <Skeleton height="16px" width="50%" />
            {/* Delegate Your Votes Button Skeleton */}
            <Skeleton height="44px" width="100%" borderRadius="md" />
          </Box>
        ) : (
          <AvatarWithText
            src={null}
            headerText={council?.name ?? "Council"}
            subheaderText={truncateAddress(councilAddress)}
            address={council?.address?.toLowerCase() ?? ""}
            withCopy
            dropdownChildren={
              hasPermission(loggedUser?.role, [
                ROLES.ADMIN,
                ROLES.SUPERADMIN,
                ROLES.MODERATOR,
                ROLES.AUTHOR,
              ]) ? (
                <MenuItem as="a" href={`/councils/edit/${council?.slug}`}>
                  Edit
                </MenuItem>
              ) : null
            }
            subheaderTooltipContent={councilAddress}
          />
        )}

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
        <Divider my="standard.xl" />
        <SummaryItems.Root>
          <SummaryItems.Item
            isLoading={isLoadingGqlResponse}
            label="Proposals voted on"
            value={votesData?.votes?.length.toString() ?? "0"}
          />
          <SummaryItems.Item
            isLoading={isLoadingGqlResponse}
            label="Delegated votes"
            value={votingPower.toString() ?? "0"}
          />

          <SummaryItems.Item
            isLoading={isLoadingGqlResponse}
            label="For/against/abstain"
            value={
              (stats && `${stats[1] ?? 0}/${stats[2] ?? 0}/${stats[3] ?? 0}`) ||
              "0/0/0"
            }
          />
        </SummaryItems.Root>
      </ProfilePageLayout.Profile>

      <ProfilePageLayout.About>
        <Stack width="100%" spacing="0" direction={{ base: "column" }}>
          <Collapse startingHeight={300} height="76">
            <Stack spacing="0" direction={{ base: "column" }}>
              <Heading
                lineHeight="32px"
                color="content.accent.default"
                variant="h3"
                mb="8px"
              >
                {/* The role of the {council?.name ?? "Council"} */}
                Mission statement
              </Heading>
              {isCouncilLoading ? (
                // Skeleton representation for loading state
                <Box display="flex" flexDirection="column" gap="20px">
                  <Skeleton height="40px" width="100%" />
                  <Skeleton height="300px" width="90%" />
                  <Skeleton height="100px" width="80%" />
                  <Skeleton height="100px" width="80%" />
                </Box>
              ) : council?.statement ? (
                // Display the actual content if it's available
                <MarkdownRenderer content={council?.statement || ""} />
              ) : (
                // Empty state if the data is available but contains no content
                <Text variant="body">No council statement added</Text>
              )}

              {isCouncilLoading ? (
                // Skeleton representation for loading state
                <Box display="flex" flexDirection="column" gap="20px">
                  <Skeleton height="100px" width="80%" />
                  <Skeleton height="100px" width="80%" />
                </Box>
              ) : members.length > -1 ? (
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
              ) : (
                <Text variant="body">No members added</Text>
              )}
            </Stack>
          </Collapse>

          <Box mt="24px">
            <Heading variant="h3" color="content.accent.default">
              Posts
            </Heading>
            {isLoadingGqlResponse ? (
              // Skeleton representation for loading state
              <Box mt="standard.xs" display="flex" flexDirection="column" gap="20px">
                <Skeleton height="60px" width="100%" />
                <Skeleton height="60px" width="90%" />
                <Skeleton height="60px" width="80%" />
              </Box>
            ) : (
              <ListRow.Container>
                {council?.posts && council.posts.length > 0 ? (
                  council.posts.map((post) => {
                    return (
                      <>
                        <ListRow.Root
                          href={`/councils/${council.slug}/posts/${post.slug}`}
                          key={post.id}
                        >
                          <ListRow.CommentSummary
                            count={post?.comments?.length}
                            comment={(post?.content as string) || ""}
                            postTitle={post?.title as string}
                            date={post?.createdAt as string}
                          />
                        </ListRow.Root>
                      </>
                    );
                  })
                ) : (
                  <EmptyState type="posts" title="No posts yet" />
                )}
              </ListRow.Container>
            )}
          </Box>
          <Box mt="24px">
            <Heading mb="standard.xs" color="content.accent.default" variant="h3">
              Past Votes
            </Heading>
            {isLoadingGqlResponse ? (
              // Skeleton representation for loading state
              <Box display="flex" flexDirection="column" gap="20px" mt="16px">
                <Skeleton height="60px" width="100%" />
                <Skeleton height="60px" width="90%" />
                <Skeleton height="60px" width="80%" />
              </Box>
            ) : votesData?.votes?.length ? (
              <ListRow.Container>
                {votesData?.votes?.map((vote) => (
                  <Link
                    href={`/voting-proposals/${vote!.proposal}`}
                    key={vote!.id}
                    _hover={{ textDecoration: "none" }}
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
                        body={findProposalBodyByVote(vote.proposal)}
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
      </ProfilePageLayout.About>
    </ProfilePageLayout.Root>
  );
}

export const documentProps = {
  title: "Council",
  image: "/social/social-councils.png",
} satisfies DocumentProps;
