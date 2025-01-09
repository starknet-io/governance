// scripts/logAllVotes.ts

import dotenv from 'dotenv';
dotenv.config();

import { GraphQLClient, gql } from 'graphql-request';
import { db } from '../db/db';
import { getChecksumAddress } from 'starknet';

/***************************************
 * GraphQL QUERIES
 **************************************/
export const GET_PROPOSALS_QUERY = gql`
  query Proposals($space: String!) {
    proposals(where: { space: $space }) {
      id
      proposal_id
    }
  }
`;

export const GET_VOTES_FOR_PROPOSAL_QUERY = gql`
  query VotesForProposal($space: String!, $proposal: Int!) {
    votes(where: { space: $space, proposal: $proposal }, first: 9999) {
      choice
      proposal
      voter {
        id
        address_type
        vote_count
      }
      created
      vp
    }
  }
`;

/***************************************
 * 1) GraphQL Client
 **************************************/
const SNAPSHOT_ENDPOINT = 'https://api.snapshot.box/graphql';
const graphQLClient = new GraphQLClient(SNAPSHOT_ENDPOINT, {
  headers: {
    'Content-Type': 'application/json',
  },
});

/***************************************
 * 2) parseChoice: numeric -> textual
 **************************************/
function parseChoice(choice: number | undefined): 'for' | 'against' | 'abstain' {
  switch (choice) {
    case 1:
      return 'for';
    case 2:
      return 'against';
    case 3:
      return 'abstain';
    default:
      return 'abstain';
  }
}

/***************************************
 * 3) DB: fetch all delegates
 *    We load "author" so we can get author.username
 **************************************/
async function fetchAllDelegates() {
  return db.query.delegates.findMany({
    with: {
      author: true, // includes .username from the users table
    },
  });
}

/***************************************
 * 4) Fetch proposals from subgraph
 **************************************/
async function fetchAllProposals(space: string) {
  const variables = { space };
  const data: any = await graphQLClient.request(GET_PROPOSALS_QUERY, variables);
  return data?.proposals || [];
}

/***************************************
 * 5) Fetch votes for a single proposal
 **************************************/
async function fetchVotesForProposal(space: string, proposalIdNum: number) {
  const variables = {
    space,
    proposal: proposalIdNum,
  };
  const data: any = await graphQLClient.request(GET_VOTES_FOR_PROPOSAL_QUERY, variables);
  return data?.votes || [];
}

/***************************************
 * 6) Compare a single vote's address
 *    against a single delegate's addresses
 **************************************/
function matchesDelegate(
  voteAddress: string,
  addressType: number | undefined,
  delegate: any,
): boolean {
  const { ethAddress, address, starknetAddress } = delegate.author || {};

  // We'll test each possible address
  const candidateAddresses: { val: string | undefined; isStarknet: boolean }[] = [
    { val: ethAddress, isStarknet: false },
    { val: address, isStarknet: false },
    { val: starknetAddress, isStarknet: true },
  ];

  for (const candidate of candidateAddresses) {
    if (!candidate.val) continue;

    if (addressType === 0 && candidate.isStarknet) {
      // Starknet -> compare checksummed
      try {
        const c1 = getChecksumAddress(voteAddress);
        const c2 = getChecksumAddress(candidate.val);
        if (c1 === c2) return true;
      } catch {
        // If getChecksumAddress fails, skip
      }
    } else if (addressType !== 0 && !candidate.isStarknet) {
      // Ethereum -> case-insensitive compare
      if (voteAddress.toLowerCase() === candidate.val.toLowerCase()) {
        return true;
      }
    }
  }

  return false;
}

/***************************************
 * 6.5) Convert raw 1e18-based value to float
 *     and round to 2 decimals
 **************************************/
function formatUnits(rawValue: string | number | bigint, decimals = 18): number {
  const valueStr = typeof rawValue === 'string' ? rawValue : rawValue.toString();
  const valueBigInt = BigInt(valueStr);

  // If length of number is <= decimals, we need to pad zeros for integer part
  const str = valueBigInt.toString();
  if (str.length <= decimals) {
    const padZeros = '0'.repeat(decimals - str.length);
    return parseFloat(`0.${padZeros}${str}`);
  }

  const integerPart = str.slice(0, str.length - decimals);
  const decimalPart = str.slice(str.length - decimals);
  return parseFloat(`${integerPart}.${decimalPart}`);
}

/***************************************
 * 7) Main logic
 **************************************/
export async function logAllVotes() {
  try {
    // 1. Get space from env or fallback
    const space = process.env.SNAPSHOT_X_SPACE || 'my-space-name';

    // 2. Fetch delegates from DB
    const allDelegates = await fetchAllDelegates();
    console.log(`Fetched ${allDelegates.length} delegates from DB.\n`);

    // 2a. Create a map: delegateId -> entire delegate object
    //     so we can easily look up username later.
    const delegateMapById = new Map<string, (typeof allDelegates)[number]>();
    for (const delegate of allDelegates) {
      delegateMapById.set(delegate.id, delegate);
    }

    // 3. Fetch proposals from subgraph
    const proposals = await fetchAllProposals(space);
    console.log(`Found ${proposals.length} proposals in space "${space}".\n`);

    // We'll store *all* rows here
    const allRows: {
      delegateId: string | null;
      address: string;
      addressType: number | undefined;
      proposalId: string;
      voteOption: string;
      votingPower: number;
      comment: string | null;
      created: number | null;
    }[] = [];

    // 4. For each proposal, fetch votes
    for (const proposal of proposals) {
      const proposalIdNum = parseInt(proposal.proposal_id ?? proposal.id, 10);
      if (Number.isNaN(proposalIdNum)) {
        console.warn('Skipping proposal with invalid proposal_id:', proposal);
        continue;
      }

      const rawVotes = await fetchVotesForProposal(space, proposalIdNum);

      for (const rawVote of rawVotes) {
        const { choice, proposal, voter, vp, created } = rawVote;
        const voteOption = parseChoice(choice);

        // voter { id, address_type, vote_count }
        const voteAddress = voter?.id || '';
        const addressType = voter?.address_type;

        // Attempt to match with a delegate from DB
        let matchedDelegateId: string | null = null;

        // Naive approach: loop all delegates
        for (const delegate of allDelegates) {
          if (matchesDelegate(voteAddress, addressType, delegate)) {
            matchedDelegateId = delegate.id;
            break; // stop after first match
          }
        }

        // Round to 2 decimals
        const rawFloat = formatUnits(vp || '0', 18);
        const votingPower = Math.round(rawFloat * 100) / 100;

        allRows.push({
          delegateId: matchedDelegateId,
          address: voteAddress,
          addressType,
          proposalId: proposal?.toString() || proposalIdNum.toString(),
          voteOption,
          votingPower,
          comment: null,
          created,
        });
      }
    }

    // 5. Filter out votes where delegateId === null
    const matchedVotes = allRows.filter((row) => row.delegateId !== null);

    // 6. Group by delegate ID
    //    Key = delegateId, Value = array of votes
    const votesByDelegate = new Map<string, typeof matchedVotes>();
    for (const row of matchedVotes) {
      // row.delegateId is not null here, so we can use non-null assertion
      const dId = row.delegateId as string;
      if (!votesByDelegate.has(dId)) {
        votesByDelegate.set(dId, []);
      }
      votesByDelegate.get(dId)!.push(row);
    }

    // 7. Output
    console.log(
      `\nFound ${matchedVotes.length} total matched votes for delegates. Grouping by delegate...`,
    );

    // We'll display each delegate's votes in a table
    for (const [delegateId, votes] of votesByDelegate.entries()) {
      // Lookup the delegate record so we can see the username
      const delegateRecord = delegateMapById.get(delegateId);
      const username = delegateRecord?.author?.username || delegateRecord?.author?.ensName || delegateId;

      console.log(`\nDelegate: ${username} | Total Votes: ${votes.length}`);
      console.table(
        votes.map((v) => ({
          address: v.address,
          addressType: v.addressType === 0 ? 'Starknet' : 'Ethereum',
          proposalId: v.proposalId,
          voteOption: v.voteOption,
          votingPower: v.votingPower,
          created: v.created,
        })),
      );
    }

    console.log('\nDone logging votes per matched delegate!');
  } catch (error) {
    console.error('Error in logAllVotes:', error);
    process.exit(1);
  }
}

/** Optional self-run if invoked directly */
if (require.main === module) {
  logAllVotes()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
