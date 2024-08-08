import { useQuery } from "@apollo/client";
import { GET_VOTES_QUERY } from "./queries";
import { transformVotes } from "./helpers";
import { trpc } from "../../utils/trpc";
import { getChecksumAddress } from "starknet";

type SkippableField = "voter" | "proposal";

export function useVotes({
  voter,
  proposal,
  space,
  skipField,
}: {
  voter?: string;
  proposal?: string;
  space?: string;
  skipField?: SkippableField;
}) {
  const selectedSpace = space || import.meta.env.VITE_APP_SNAPSHOTX_SPACE;
  const variables = {
    where: {
      ...(voter ? { voter } : {}),
      ...(selectedSpace ? { space: selectedSpace } : {}),
      ...(proposal ? { proposal: parseInt(proposal) } : {}),
    },
  };
  let toSkip = null;
  if (skipField === "voter") {
    toSkip = voter;
  } else if (skipField === "proposal") {
    toSkip = proposal;
  }
  const { data, loading, refetch, error } = useQuery(GET_VOTES_QUERY, {
    variables,
    skip: !toSkip || !toSkip?.toString()?.length,
    context: { clientName: "snapshotX" }, // Adding context to route the query to the second link
  });

  const {
    data: commentData,
    isLoading: commentLoading,
    error: commentError,
  } = trpc.votes.getNonEmptyCommentsForProposal.useQuery(
    {
      proposalId: proposal,
    },
    {
      enabled: !!proposal,
    },
  );
  const transformedVotes = transformVotes(data);

  // Efficiently merge votes with comments
  const mergedVotes = transformedVotes.map((vote) => ({
    ...vote,
    comment:
      commentData?.find((comment) => {
        let address = vote.voter;
        let commentAddress = comment.voterAddress;
        if (address.length > 42) {
          address = getChecksumAddress(address);
          commentAddress = getChecksumAddress(commentAddress);
        }
        return address === commentAddress;
      })?.comment || null,
  }));

  return { data: { votes: mergedVotes }, loading, refetch, error };
}
