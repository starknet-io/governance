import { IProposalWithComments } from "@yukilabs/governance-backend/src/routers/proposals";
import { trpc } from "@yukilabs/governance-frontend/src/utils/trpc";
import { useMemo } from "react";
import { ISearchItem } from "./buildItems";

type ProposalsByIds = Record<number | string, IProposalWithComments>;

export default function usePopulateProposals(searchResults: ISearchItem[]) {
  const { data: allProposals } = trpc.proposals.getProposals.useQuery();
  const filteredSearchResults = useMemo(() => {
    const proposalsId: ProposalsByIds | undefined = allProposals?.reduce(
      (acc, proposal) => {
        acc[proposal.id] = proposal;
        return acc;
      },
      {} as ProposalsByIds,
    );

    return searchResults
      .filter(
        (item) =>
          item.type !== "voting_proposal" || !!proposalsId?.[item.refID],
      )
      .map((item) => {
        if (item.type === "voting_proposal") {
          return {
            ...item,
            proposal: proposalsId?.[item.refID],
          };
        }
        return item;
      });
  }, [searchResults, allProposals]);

  return filteredSearchResults;
}
