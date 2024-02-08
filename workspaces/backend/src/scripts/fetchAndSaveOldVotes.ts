import { graphqlClient } from '../utils/graphqlClient';
import { db } from '../db/db';
import { oldVotes } from '../db/schema/oldVotes';
import { and, eq } from 'drizzle-orm';

interface OldVoteData {
  proposal: {
    id: string;
    title: string;
  };
  reason: string;
  choice: any;
  choices: string[];
  voter: string;
  vp: number;
  created: string;
}

async function saveOldVote(oldVoteData: OldVoteData, delegateId: string) {
  try {
    const existingRecord = await db.query.oldVotes.findFirst({
      where: and(
        eq(oldVotes.delegateId, delegateId),
        eq(oldVotes.proposalId, oldVoteData.proposal.id),
      ),
    });

    if (!existingRecord) {
      await db.insert(oldVotes).values({
        delegateId: delegateId,
        proposalId: oldVoteData?.proposal?.id || '',
        title: oldVoteData?.proposal?.title || '',
        body: oldVoteData?.reason || '',
        voteCount: Math.round(oldVoteData?.vp) || 0,
        votePreference: oldVoteData.choice,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      console.log('EXISTS FOR: ', delegateId, oldVoteData?.proposal?.id);
    }
  } catch (error) {
    console.error('Error saving old vote:', error);
    throw error;
  }
}

const space = process.env.SNAPSHOT_SPACE;

export async function getVotingProposals() {
  const query = `
    query DelegateProposals {
      proposals(
        first: 20
        skip: 0
        orderBy: "created"
        orderDirection: asc
        where: { space: "${space}" }
      ) {
        id
        title
        choices
        start
        end
        snapshot
        state
        scores
        scores_total
        author
        space {
          id
          name
        }
      }
    }
  `;
  const response: { proposals: any[] } = await graphqlClient.request(query);
  return response.proposals;
}

async function fetchAllVotesForProposal(proposalId: string) {
  const query = `
    query DelegatesVotes {
      votes (
        first: 1000
        skip: 0
        where: {
          proposal: "${proposalId}",
        }
        orderBy: "created",
        orderDirection: desc
      ) {
        id
        choice
        voter
        reason
        created
        proposal {
          id
          title
        }
        vp
      }
    }`;

  const response: { votes: OldVoteData[] } = await graphqlClient.request(query);
  return response.votes;
}

async function fetchAllDelegates() {
  try {
    const delegates: any = await db.query.delegates.findMany({
      columns: {
        id: true,
      },
      with: {
        author: {
          columns: {
            address: true,
          },
        },
      },
    });

    return delegates.map((delegate: any) => ({
      id: delegate.id,
      address: delegate?.author?.address || '',
    }));
  } catch (error) {
    console.error('Error fetching delegates:', error);
    throw error; // Rethrow the error for upstream handling
  }
}

async function processDelegateVotes(
  delegates: { id: string; address?: string }[],
) {
  const proposals = await getVotingProposals();

  for (const proposal of proposals) {
    const allVotesForProposal = await fetchAllVotesForProposal(proposal.id);
    for (const oldVoteForProposal of allVotesForProposal) {
      const oldVote = {
        ...oldVoteForProposal,
      };
      const correspondingDelegate = delegates.find(
        (delegate) =>
          delegate?.address?.toLowerCase() === oldVote?.voter?.toLowerCase(),
      );
      if (correspondingDelegate) {
        await saveOldVote(oldVote, correspondingDelegate.id);
      }
    }
  }
}

export async function processOldVotes() {
  const delegates = await fetchAllDelegates();
  await processDelegateVotes(delegates);
}

processOldVotes();
