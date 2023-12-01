export const transformProposalData = (data: any) => {
  if (data && data.proposals && data.proposals.length) {
    return data.proposals.map((proposal: any) => transformProposal(proposal));
  } else {
    return data;
  }
};

function getProposalState(proposal: any, current: number) {
  if (proposal.executed) return 'executed';
  if (proposal.max_end * 1000 <= current) {
    return 'closed';
  }
  if (proposal.start * 1000 > current) return 'pending';

  return 'active';
}

export const transformProposal = (proposal: any) => {
  const timeNow = Date.now();
  return {
    ...proposal,
    ...proposal.metadata,
    author: proposal.author.id,
    end: proposal.max_end,
    id: proposal.proposal_id,
    choices: ['For', 'Against', 'Abstain'],
    scores: [
      parseFloat(proposal.scores_1),
      parseFloat(proposal.scores_2),
      parseFloat(proposal.scores_3),
    ],
    state: getProposalState(proposal, timeNow),
  };
};
