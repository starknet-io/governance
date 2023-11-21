export const transformProposalData = (data) => {
  if (data && data.proposals && data.proposals.length) {
    return data.proposals.map((proposal) => transformProposal(proposal));
  } else {
    return data;
  }
};

export const transformProposal = (proposal) => {
  return {
    ...proposal,
    ...proposal.metadata,
    author: proposal.author.id,
    end: proposal.max_end,
    id: proposal.proposal_id,
    choices: ["For", "Against", "Abstain"],
    scores: [
      parseFloat(proposal.scores_1),
      parseFloat(proposal.scores_2),
      parseFloat(proposal.scores_3),
    ],
    state: "active",
  };
};

export const transformVote = (vote) => {
  return {
    ...vote,
    voter: vote.voter.id,
  };
};

export const transformVotes = (data) => {
  if (data && data.votes && data.votes.length) {
    return data.votes.map((vote) => transformVote(vote));
  } else {
    return data;
  }
};
