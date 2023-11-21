export const transformProposalData = (data: any) => {
  if (data && data.proposals && data.proposals.length) {
    return data.proposals.map((proposal: any) => transformProposal(proposal))
  } else {
    return data;
  }
};

export const transformProposal = (proposal: any) => {
  return {
    ...proposal,
    ...proposal.metadata,
    author: proposal.author.id,
    end: proposal.max_end,
    id: proposal.proposal_id,
    "choices": [
      "For",
      "Against",
      "Abstain",
    ],
    scores: [
      parseFloat(proposal.scores_1),
      parseFloat(proposal.scores_2),
      parseFloat(proposal.scores_3),
    ],
    state: "active",
  }
}
