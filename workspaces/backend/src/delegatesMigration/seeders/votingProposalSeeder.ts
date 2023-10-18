import { gql, GraphQLClient } from 'graphql-request';
import { Algolia } from '../../utils/algolia';

type CategoryEnum = 'category1' | 'category2' | 'category3';

interface IProposal {
  id: string;
  title: string;
  choices: string[];
  start: number;
  category?: CategoryEnum;
  end: number;
  snapshot: string;
  state: string;
  scores: number[];
  scores_total: number;
  author: string;
  space: { id: string; name: string };
}

const endpoint = `https://hub.snapshot.org/graphql`;
const space = 'robwalsh.eth';

const graphQLClient = new GraphQLClient(endpoint, {
  method: `GET`,
});

const GET_PROPOSALS = gql`
  query proposals(
    $space: String!
    $orderDirection: OrderDirection!
    $searchQuery: String = ""
    $first: Int = 20
    $skip: Int = 0
  ) {
    proposals(
      first: $first
      skip: $skip
      orderBy: "created"
      orderDirection: $orderDirection
      where: { space: $space, title_contains: $searchQuery }
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

export async function seedVotingProposals() {
  console.log('Seeding voting proposals');
  const limit = 20;
  const offset = 0;
  const { proposals: queriedProposals } = (await graphQLClient.request(
    GET_PROPOSALS,
    {
      orderDirection: 'asc',
      first: limit,
      skip: offset,
      space,
    },
  )) as { proposals: IProposal[] };
  queriedProposals.forEach(async (proposal) => {
    await Algolia.saveObjectToIndex({
      name: proposal.title ?? '',
      content: proposal.author + ' ' + proposal.choices.join(' '),
      type: 'voting_proposal',
      refID: proposal.id,
    });
  });
  console.log('Done Seeding voting proposals');
}
