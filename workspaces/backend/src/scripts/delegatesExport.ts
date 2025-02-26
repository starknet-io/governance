// scripts/logAllVotes.ts
import dotenv from 'dotenv';
dotenv.config();

import { GraphQLClient, gql } from 'graphql-request';
import { db } from '../db/db';
import { getChecksumAddress } from 'starknet';
import { eq } from 'drizzle-orm';
import { oldVotes } from '../db/schema/oldVotes';
import { delegateVotes } from '../db/schema/delegatesVotes';

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
 * 2) parseChoice: numeric -> 'for' | 'against' | 'abstain'
 **************************************/
function parseChoice(
  choice: number | undefined,
): 'for' | 'against' | 'abstain' {
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
 **************************************/
async function fetchAllDelegates() {
  return db.query.delegates.findMany({
    with: {
      author: true, // includes .username, .ensName, .ethAddress, .starknetAddress, etc.
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
  const data: any = await graphQLClient.request(
    GET_VOTES_FOR_PROPOSAL_QUERY,
    variables,
  );
  return data?.votes || [];
}

/***************************************
 * 6) Build a map: normalized address -> delegateId
 **************************************/
function normalizeAddress(address: string, isStarknet: boolean): string {
  if (!address) return '';
  try {
    if (isStarknet) {
      // Use checksummed address for Starknet
      return getChecksumAddress(address);
    } else {
      // Lowercase for Ethereum
      return address.toLowerCase();
    }
  } catch {
    // If checksumming fails, fallback
    return '';
  }
}

function buildAddressMap(delegates: any[]) {
  // Key: normalized address (Starknet or ETH)
  // Value: delegateId
  const addressMap = new Map<string, string>();

  for (const delegate of delegates) {
    const { id, author } = delegate;
    if (!author) continue;

    // Possibly multiple addresses
    const ethAddr = author.ethAddress || author.address; // fallback for ETH
    const starknetAddr = author.starknetAddress;

    // ETH -> store as lowercase
    if (ethAddr) {
      const normEth = normalizeAddress(ethAddr, false);
      if (normEth) addressMap.set(normEth, id);
    }

    // Starknet -> store checksummed
    if (starknetAddr) {
      const normSn = normalizeAddress(starknetAddr, true);
      if (normSn) addressMap.set(normSn, id);
    }
  }

  return addressMap;
}

/***************************************
 * 6.5) Convert raw 1e18-based value to float
 **************************************/
function formatUnits(
  rawValue: string | number | bigint,
  decimals = 18,
): number {
  const valueStr =
    typeof rawValue === 'string' ? rawValue : rawValue.toString();
  const valueBigInt = BigInt(valueStr);

  // If length of number is <= decimals, pad zeros
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

    // 2a. Build a single map for fast address -> delegateId lookups
    const addressMap = buildAddressMap(allDelegates);

    // 2b. Also keep a quick map from delegateId -> delegate record
    const delegateMapById = new Map<string, (typeof allDelegates)[number]>();
    for (const delegate of allDelegates) {
      delegateMapById.set(delegate.id, delegate);
    }

    // 3. Fetch proposals from subgraph
    const proposals = await fetchAllProposals(space);
    console.log(`Found ${proposals.length} proposals in space "${space}".\n`);

    // We'll store all new (Snapshot) votes here
    const allNewVotes: {
      delegateId: string | null;
      proposalId: string;
      voteOption: 'for' | 'against' | 'abstain';
      votingPower: number;
      address: string;
      addressType: number | undefined;
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
        const { choice, proposal, voter, vp } = rawVote;
        const voteOption = parseChoice(choice);

        // Voter info
        const voteAddress = voter?.id || '';
        const addressType = voter?.address_type;
        const isStarknet = addressType === 0;

        // Single map lookup -> delegateId
        const norm = normalizeAddress(voteAddress, isStarknet);
        const matchedDelegateId = addressMap.get(norm) || null;

        // Convert vp from 1e18
        const rawFloat = formatUnits(vp || '0', 18);
        const votingPower = Math.round(rawFloat * 100) / 100;

        allNewVotes.push({
          delegateId: matchedDelegateId,
          proposalId: proposal?.toString() || proposalIdNum.toString(),
          voteOption,
          votingPower,
          address: voteAddress,
          addressType,
        });
      }
    }

    // 5. Filter out new votes where delegateId === null
    const matchedNewVotes = allNewVotes.filter((v) => v.delegateId !== null);

    // 6. Group matched new votes by delegate ID
    const newVotesByDelegate = new Map<string, typeof matchedNewVotes>();
    for (const v of matchedNewVotes) {
      const dId = v.delegateId as string;
      if (!newVotesByDelegate.has(dId)) {
        newVotesByDelegate.set(dId, []);
      }
      newVotesByDelegate.get(dId)!.push(v);
    }

    // 7. For each matched delegate, merge old & new votes in a single array
    console.log(
      `\nFound ${matchedNewVotes.length} total matched new votes. Now retrieving old votes & merging...\n`,
    );

    for (const [delegateId, newVotes] of newVotesByDelegate.entries()) {
      // The delegate record
      const delegateRecord = delegateMapById.get(delegateId);
      const username =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delegateRecord?.author?.username ||
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delegateRecord?.author?.ensName ||
        delegateId;

      // 1) Fetch old (legacy) votes
      const legacyVotes = await db.query.oldVotes.findMany({
        where: eq(oldVotes.delegateId, delegateId),
      });

      // 2) Transform old votes to the same shape
      const oldTransformed = legacyVotes.map((lv) => ({
        delegateId,
        proposalId: lv.proposalId || '',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        voteOption: parseChoice(lv.votePreference),
        votingPower: lv.voteCount ?? 0,
        // We'll just store the DB's ethAddress or fallback for old votes
        // Because old = Ethereum
        address:
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          delegateRecord?.author?.ethAddress ||
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          delegateRecord?.author?.address ||
          '0x???',
        addressType: 1, // indicates Ethereum
      }));

      // 3) Merge new + old
      const combinedVotes = [...newVotes, ...oldTransformed];

      // 4) Calculate total breakdown across old + new
      const totalFor = combinedVotes.filter(
        (v) => v.voteOption === 'for',
      ).length;
      const totalAgainst = combinedVotes.filter(
        (v) => v.voteOption === 'against',
      ).length;
      const totalAbstain = combinedVotes.filter(
        (v) => v.voteOption === 'abstain',
      ).length;

      // 5) Fetch voting power from delegateVotes table for L1 / L2
      const dvRecord = await db.query.delegateVotes.findFirst({
        where: eq(delegateVotes.delegateId, delegateId),
      });
      const l1Power = dvRecord?.votingPowerLayerOne || 0;
      const l2Power = dvRecord?.votingPowerLayerTwo || 0;

      // 6) Print summary info
      console.log(`\nDelegate: ${username}`);
      console.log(
        `Voting Power L1: ${l1Power} | Voting Power L2: ${l2Power} | Combined Votes: For=${totalFor} Against=${totalAgainst} Abstain=${totalAbstain} | Total Combined Votes: ${combinedVotes.length}`,
      );

      // 7) Print a single table with all merged votes
      const ethAddress =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delegateRecord?.author?.ethAddress ||
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delegateRecord?.author?.address ||
        '';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const starknetAddress = delegateRecord?.author?.starknetAddress || '';

      console.log('\nAll Votes (Old + New):');
      console.table(
        combinedVotes.map((cv) => ({
          proposalId: cv.proposalId,
          voteOption: cv.voteOption,
          votingPower: cv.votingPower,
          addressType: cv.addressType === 0 ? 'Starknet' : 'Eth',
          ethAddress,
          starknetAddress,
        })),
      );
    }

    console.log('\nDone logging combined votes per matched delegate!');
  } catch (error) {
    console.error('Error in logAllVotes:', error);
    process.exit(1);
  }
}

/** Optional: self-run if invoked directly */
if (require.main === module) {
  logAllVotes()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export const exportVotesCSV = async (proposalIdNum: any) => {
  try {
    // 1. Get space from env or fallback
    const space = process.env.SNAPSHOT_X_SPACE || 'my-space-name';

    // 2. Fetch delegates from DB
    const allDelegates = await fetchAllDelegates();

    // 2a. Build a single map for fast address -> delegateId lookups
    const addressMap = buildAddressMap(allDelegates);

    // 2b. Also keep a quick map from delegateId -> delegate record
    const delegateMapById = new Map<string, (typeof allDelegates)[number]>();
    for (const delegate of allDelegates) {
      delegateMapById.set(delegate.id, delegate);
    }

    // 3. Fetch proposals from subgraph

    // We'll store all new (Snapshot) votes here
    const allNewVotes: {
      delegateId: string | null;
      proposalId: string;
      voteOption: 'for' | 'against' | 'abstain';
      votingPower: number;
      address: string;
      addressType: number | undefined;
    }[] = [];

    const rawVotes = await fetchVotesForProposal(space, proposalIdNum);
    for (const rawVote of rawVotes) {
      const { choice, proposal, voter, vp } = rawVote;
      const voteOption = parseChoice(choice);

      // Voter info
      const voteAddress = voter?.id || '';
      const addressType = voter?.address_type;
      const isStarknet = addressType === 0;

      // Single map lookup -> delegateId
      const norm = normalizeAddress(voteAddress, isStarknet);
      const matchedDelegateId = addressMap.get(norm) || null;

      // Convert vp from 1e18
      const rawFloat = formatUnits(vp || '0', 18);
      const votingPower = Math.round(rawFloat * 100) / 100;

      allNewVotes.push({
        delegateId: matchedDelegateId,
        proposalId: proposal?.toString() || proposalIdNum.toString(),
        voteOption,
        votingPower,
        address: voteAddress,
        addressType,
      });
    }

    // 5. Filter out new votes where delegateId === null
    const matchedNewVotes = allNewVotes.filter((v) => v.delegateId !== null);

    // 6. Group matched new votes by delegate ID
    const newVotesByDelegate = new Map<string, typeof matchedNewVotes>();
    for (const v of matchedNewVotes) {
      const dId = v.delegateId as string;
      if (!newVotesByDelegate.has(dId)) {
        newVotesByDelegate.set(dId, []);
      }
      newVotesByDelegate.get(dId)!.push(v);
    }

    // 7. Create CSV content
    let csvContent =
      'Delegate,ETH Address,Starknet Address,Proposal ID,Vote Option,Voting Power,Address Type\n';

    // For each delegate, merge old & new votes and add to CSV
    for (const [delegateId, newVotes] of newVotesByDelegate.entries()) {
      // The delegate record
      const delegateRecord = delegateMapById.get(delegateId);
      const username =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delegateRecord?.author?.username ||
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delegateRecord?.author?.ensName ||
        delegateId;

      // Fetch old (legacy) votes
      const legacyVotes: any[] = [];
      // const legacyVotes = await db.query.oldVotes.findMany({
      //   where: eq(oldVotes.delegateId, delegateId),
      // });

      // Transform old votes to the same shape
      const oldTransformed = legacyVotes.map((lv) => ({
        delegateId,
        proposalId: lv.proposalId || '',
        voteOption: parseChoice(lv.votePreference),
        votingPower: lv.voteCount ?? 0,
        address:
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          delegateRecord?.author?.ethAddress ||
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          delegateRecord?.author?.address ||
          '0x???',
        addressType: 1, // indicates Ethereum
      }));


      // Merge new + old votes
      const combinedVotes = [...newVotes, ...oldTransformed];

      // ETH and Starknet addresses
      const ethAddress =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delegateRecord?.author?.ethAddress ||
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delegateRecord?.author?.address ||
        '';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const starknetAddress = delegateRecord?.author?.starknetAddress || '';

      // Add each vote to the CSV
      for (const vote of combinedVotes) {
        csvContent +=
          [
            escapeCsvField(username),
            escapeCsvField(ethAddress),
            escapeCsvField(starknetAddress),
            // l1Power,
            // l2Power,
            escapeCsvField(vote.proposalId),
            escapeCsvField(vote.voteOption),
            vote.votingPower,
            vote.addressType === 0 ? 'Starknet' : 'Eth',
          ].join(',') + '\n';
      }
    }

    return csvContent;
  } catch (error) {
    console.error('Error generating CSV:', error);
    throw new Error('Failed to generate votes CSV');
  }
};

// Helper function to properly escape CSV fields
function escapeCsvField(field: string): string {
  if (!field) return '';

  // If the field contains commas, quotes, or newlines, enclose it in quotes
  const needsQuotes = /[",\n\r]/.test(field);

  if (needsQuotes) {
    // Double any quotes in the field
    const escaped = field.replace(/"/g, '""');
    return `"${escaped}"`;
  }

  return field;
}
