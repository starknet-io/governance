/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Any: { input: any; output: any; }
};

export type Alias = {
  __typename?: 'Alias';
  address: Scalars['String']['output'];
  alias: Scalars['String']['output'];
  created: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  ipfs?: Maybe<Scalars['String']['output']>;
};

export type AliasWhere = {
  address?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  alias?: InputMaybe<Scalars['String']['input']>;
  alias_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  created?: InputMaybe<Scalars['Int']['input']>;
  created_gt?: InputMaybe<Scalars['Int']['input']>;
  created_gte?: InputMaybe<Scalars['Int']['input']>;
  created_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  created_lt?: InputMaybe<Scalars['Int']['input']>;
  created_lte?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ipfs?: InputMaybe<Scalars['String']['input']>;
  ipfs_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type DelegationPortal = {
  __typename?: 'DelegationPortal';
  delegationApi: Scalars['String']['output'];
  delegationContract: Scalars['String']['output'];
  delegationType: Scalars['String']['output'];
};

export type Follow = {
  __typename?: 'Follow';
  created: Scalars['Int']['output'];
  follower: Scalars['String']['output'];
  id: Scalars['String']['output'];
  ipfs?: Maybe<Scalars['String']['output']>;
  space: Space;
};

export type FollowWhere = {
  created?: InputMaybe<Scalars['Int']['input']>;
  created_gt?: InputMaybe<Scalars['Int']['input']>;
  created_gte?: InputMaybe<Scalars['Int']['input']>;
  created_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  created_lt?: InputMaybe<Scalars['Int']['input']>;
  created_lte?: InputMaybe<Scalars['Int']['input']>;
  follower?: InputMaybe<Scalars['String']['input']>;
  follower_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ipfs?: InputMaybe<Scalars['String']['input']>;
  ipfs_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  space?: InputMaybe<Scalars['String']['input']>;
  space_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type Item = {
  __typename?: 'Item';
  id: Scalars['String']['output'];
  spacesCount?: Maybe<Scalars['Int']['output']>;
};

export type Message = {
  __typename?: 'Message';
  address?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  ipfs?: Maybe<Scalars['String']['output']>;
  mci?: Maybe<Scalars['Int']['output']>;
  receipt?: Maybe<Scalars['String']['output']>;
  sig?: Maybe<Scalars['String']['output']>;
  space?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  version?: Maybe<Scalars['String']['output']>;
};

export type MessageWhere = {
  address?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  mci?: InputMaybe<Scalars['Int']['input']>;
  mci_gt?: InputMaybe<Scalars['Int']['input']>;
  mci_gte?: InputMaybe<Scalars['Int']['input']>;
  mci_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  mci_lt?: InputMaybe<Scalars['Int']['input']>;
  mci_lte?: InputMaybe<Scalars['Int']['input']>;
  space?: InputMaybe<Scalars['String']['input']>;
  space_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  timestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type Metrics = {
  __typename?: 'Metrics';
  categories?: Maybe<Scalars['Any']['output']>;
  total?: Maybe<Scalars['Int']['output']>;
};

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Proposal = {
  __typename?: 'Proposal';
  app?: Maybe<Scalars['String']['output']>;
  author: Scalars['String']['output'];
  body?: Maybe<Scalars['String']['output']>;
  choices: Array<Maybe<Scalars['String']['output']>>;
  created: Scalars['Int']['output'];
  discussion: Scalars['String']['output'];
  end: Scalars['Int']['output'];
  flagged?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['String']['output'];
  ipfs?: Maybe<Scalars['String']['output']>;
  link?: Maybe<Scalars['String']['output']>;
  network: Scalars['String']['output'];
  plugins: Scalars['Any']['output'];
  privacy?: Maybe<Scalars['String']['output']>;
  quorum: Scalars['Float']['output'];
  scores?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  scores_by_strategy?: Maybe<Scalars['Any']['output']>;
  scores_state?: Maybe<Scalars['String']['output']>;
  scores_total?: Maybe<Scalars['Float']['output']>;
  scores_updated?: Maybe<Scalars['Int']['output']>;
  snapshot?: Maybe<Scalars['String']['output']>;
  space?: Maybe<Space>;
  start: Scalars['Int']['output'];
  state?: Maybe<Scalars['String']['output']>;
  strategies: Array<Maybe<Strategy>>;
  symbol: Scalars['String']['output'];
  title: Scalars['String']['output'];
  type?: Maybe<Scalars['String']['output']>;
  updated?: Maybe<Scalars['Int']['output']>;
  validation?: Maybe<Validation>;
  votes?: Maybe<Scalars['Int']['output']>;
};

export type ProposalWhere = {
  app?: InputMaybe<Scalars['String']['input']>;
  app_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  app_not?: InputMaybe<Scalars['String']['input']>;
  app_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  author?: InputMaybe<Scalars['String']['input']>;
  author_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  created?: InputMaybe<Scalars['Int']['input']>;
  created_gt?: InputMaybe<Scalars['Int']['input']>;
  created_gte?: InputMaybe<Scalars['Int']['input']>;
  created_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  created_lt?: InputMaybe<Scalars['Int']['input']>;
  created_lte?: InputMaybe<Scalars['Int']['input']>;
  end?: InputMaybe<Scalars['Int']['input']>;
  end_gt?: InputMaybe<Scalars['Int']['input']>;
  end_gte?: InputMaybe<Scalars['Int']['input']>;
  end_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  end_lt?: InputMaybe<Scalars['Int']['input']>;
  end_lte?: InputMaybe<Scalars['Int']['input']>;
  flagged?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ipfs?: InputMaybe<Scalars['String']['input']>;
  ipfs_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  network?: InputMaybe<Scalars['String']['input']>;
  network_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  plugins_contains?: InputMaybe<Scalars['String']['input']>;
  scores_state?: InputMaybe<Scalars['String']['input']>;
  scores_state_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  space?: InputMaybe<Scalars['String']['input']>;
  space_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  space_verified?: InputMaybe<Scalars['Boolean']['input']>;
  start?: InputMaybe<Scalars['Int']['input']>;
  start_gt?: InputMaybe<Scalars['Int']['input']>;
  start_gte?: InputMaybe<Scalars['Int']['input']>;
  start_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  start_lt?: InputMaybe<Scalars['Int']['input']>;
  start_lte?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  strategies_contains?: InputMaybe<Scalars['String']['input']>;
  title_contains?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  updated?: InputMaybe<Scalars['Int']['input']>;
  updated_gt?: InputMaybe<Scalars['Int']['input']>;
  updated_gte?: InputMaybe<Scalars['Int']['input']>;
  updated_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  updated_lt?: InputMaybe<Scalars['Int']['input']>;
  updated_lte?: InputMaybe<Scalars['Int']['input']>;
  validation?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  aliases?: Maybe<Array<Maybe<Alias>>>;
  follows?: Maybe<Array<Maybe<Follow>>>;
  messages?: Maybe<Array<Maybe<Message>>>;
  networks?: Maybe<Array<Maybe<Item>>>;
  plugins?: Maybe<Array<Maybe<Item>>>;
  proposal?: Maybe<Proposal>;
  proposals?: Maybe<Array<Maybe<Proposal>>>;
  ranking?: Maybe<RankingObject>;
  roles?: Maybe<Array<Maybe<Role>>>;
  skins?: Maybe<Array<Maybe<Item>>>;
  space?: Maybe<Space>;
  spaces?: Maybe<Array<Maybe<Space>>>;
  statement?: Maybe<Statement>;
  statements?: Maybe<Array<Maybe<Statement>>>;
  strategies?: Maybe<Array<Maybe<StrategyItem>>>;
  strategy?: Maybe<StrategyItem>;
  subscriptions?: Maybe<Array<Maybe<Subscription>>>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
  validations?: Maybe<Array<Maybe<Item>>>;
  vote?: Maybe<Vote>;
  votes?: Maybe<Array<Maybe<Vote>>>;
  vp?: Maybe<Vp>;
};


export type QueryAliasesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AliasWhere>;
};


export type QueryFollowsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<FollowWhere>;
};


export type QueryMessagesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<MessageWhere>;
};


export type QueryProposalArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryProposalsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProposalWhere>;
};


export type QueryRankingArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RankingWhere>;
};


export type QueryRolesArgs = {
  where?: InputMaybe<RolesWhere>;
};


export type QuerySpaceArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySpacesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SpaceWhere>;
};


export type QueryStatementArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryStatementsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<StatementsWhere>;
};


export type QueryStrategyArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySubscriptionsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SubscriptionWhere>;
};


export type QueryUserArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUsersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UsersWhere>;
};


export type QueryVoteArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryVotesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<VoteWhere>;
};


export type QueryVpArgs = {
  proposal?: InputMaybe<Scalars['String']['input']>;
  space: Scalars['String']['input'];
  voter: Scalars['String']['input'];
};

export type RankingObject = {
  __typename?: 'RankingObject';
  items?: Maybe<Array<Maybe<Space>>>;
  metrics?: Maybe<Metrics>;
};

export type RankingWhere = {
  category?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  network?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type Role = {
  __typename?: 'Role';
  permissions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  space?: Maybe<Scalars['String']['output']>;
};

export type RolesWhere = {
  address?: InputMaybe<Scalars['String']['input']>;
};

export type Space = {
  __typename?: 'Space';
  about?: Maybe<Scalars['String']['output']>;
  activeProposals?: Maybe<Scalars['Int']['output']>;
  admins?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  avatar?: Maybe<Scalars['String']['output']>;
  categories?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  children?: Maybe<Array<Maybe<Space>>>;
  coingecko?: Maybe<Scalars['String']['output']>;
  delegationPortal?: Maybe<DelegationPortal>;
  domain?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  filters?: Maybe<SpaceFilters>;
  flagged?: Maybe<Scalars['Boolean']['output']>;
  followersCount?: Maybe<Scalars['Int']['output']>;
  followersCount7d?: Maybe<Scalars['Int']['output']>;
  github?: Maybe<Scalars['String']['output']>;
  guidelines?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  location?: Maybe<Scalars['String']['output']>;
  members?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  moderators?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  name?: Maybe<Scalars['String']['output']>;
  network?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<Space>;
  plugins?: Maybe<Scalars['Any']['output']>;
  private?: Maybe<Scalars['Boolean']['output']>;
  proposalsCount?: Maybe<Scalars['Int']['output']>;
  proposalsCount7d?: Maybe<Scalars['Int']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
  skin?: Maybe<Scalars['String']['output']>;
  strategies?: Maybe<Array<Maybe<Strategy>>>;
  symbol?: Maybe<Scalars['String']['output']>;
  template?: Maybe<Scalars['String']['output']>;
  terms?: Maybe<Scalars['String']['output']>;
  treasuries?: Maybe<Array<Maybe<Treasury>>>;
  twitter?: Maybe<Scalars['String']['output']>;
  validation?: Maybe<Validation>;
  verified?: Maybe<Scalars['Boolean']['output']>;
  voteValidation?: Maybe<Validation>;
  votesCount?: Maybe<Scalars['Int']['output']>;
  votesCount7d?: Maybe<Scalars['Int']['output']>;
  voting?: Maybe<SpaceVoting>;
  website?: Maybe<Scalars['String']['output']>;
};

export type SpaceFilters = {
  __typename?: 'SpaceFilters';
  minScore?: Maybe<Scalars['Float']['output']>;
  onlyMembers?: Maybe<Scalars['Boolean']['output']>;
};

export type SpaceVoting = {
  __typename?: 'SpaceVoting';
  aliased?: Maybe<Scalars['Boolean']['output']>;
  blind?: Maybe<Scalars['Boolean']['output']>;
  delay?: Maybe<Scalars['Int']['output']>;
  hideAbstain?: Maybe<Scalars['Boolean']['output']>;
  period?: Maybe<Scalars['Int']['output']>;
  privacy?: Maybe<Scalars['String']['output']>;
  quorum?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type SpaceWhere = {
  id?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type Statement = {
  __typename?: 'Statement';
  about?: Maybe<Scalars['String']['output']>;
  created: Scalars['Int']['output'];
  delegate?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  ipfs: Scalars['String']['output'];
  space: Scalars['String']['output'];
  statement?: Maybe<Scalars['String']['output']>;
  updated: Scalars['Int']['output'];
};

export type StatementsWhere = {
  created?: InputMaybe<Scalars['Int']['input']>;
  created_gt?: InputMaybe<Scalars['Int']['input']>;
  created_gte?: InputMaybe<Scalars['Int']['input']>;
  created_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  created_lt?: InputMaybe<Scalars['Int']['input']>;
  created_lte?: InputMaybe<Scalars['Int']['input']>;
  delegate?: InputMaybe<Scalars['String']['input']>;
  delegate_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ipfs?: InputMaybe<Scalars['String']['input']>;
  ipfs_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  space?: InputMaybe<Scalars['String']['input']>;
  space_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type Strategy = {
  __typename?: 'Strategy';
  name: Scalars['String']['output'];
  network?: Maybe<Scalars['String']['output']>;
  params?: Maybe<Scalars['Any']['output']>;
};

export type StrategyItem = {
  __typename?: 'StrategyItem';
  about?: Maybe<Scalars['String']['output']>;
  author?: Maybe<Scalars['String']['output']>;
  examples?: Maybe<Array<Maybe<Scalars['Any']['output']>>>;
  id: Scalars['String']['output'];
  schema?: Maybe<Scalars['Any']['output']>;
  spacesCount?: Maybe<Scalars['Int']['output']>;
  version?: Maybe<Scalars['String']['output']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  address: Scalars['String']['output'];
  created: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  ipfs?: Maybe<Scalars['String']['output']>;
  space: Space;
};

export type SubscriptionWhere = {
  address?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  created?: InputMaybe<Scalars['Int']['input']>;
  created_gt?: InputMaybe<Scalars['Int']['input']>;
  created_gte?: InputMaybe<Scalars['Int']['input']>;
  created_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  created_lt?: InputMaybe<Scalars['Int']['input']>;
  created_lte?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ipfs?: InputMaybe<Scalars['String']['input']>;
  ipfs_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  space?: InputMaybe<Scalars['String']['input']>;
  space_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type Treasury = {
  __typename?: 'Treasury';
  address?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  network?: Maybe<Scalars['String']['output']>;
};

export type User = {
  __typename?: 'User';
  about?: Maybe<Scalars['String']['output']>;
  avatar?: Maybe<Scalars['String']['output']>;
  created: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  ipfs?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type UsersWhere = {
  created?: InputMaybe<Scalars['Int']['input']>;
  created_gt?: InputMaybe<Scalars['Int']['input']>;
  created_gte?: InputMaybe<Scalars['Int']['input']>;
  created_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  created_lt?: InputMaybe<Scalars['Int']['input']>;
  created_lte?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ipfs?: InputMaybe<Scalars['String']['input']>;
  ipfs_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type Validation = {
  __typename?: 'Validation';
  name: Scalars['String']['output'];
  params?: Maybe<Scalars['Any']['output']>;
};

export type Vote = {
  __typename?: 'Vote';
  app?: Maybe<Scalars['String']['output']>;
  choice: Scalars['Any']['output'];
  created: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  ipfs?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<Scalars['Any']['output']>;
  proposal?: Maybe<Proposal>;
  reason?: Maybe<Scalars['String']['output']>;
  space: Space;
  voter: Scalars['String']['output'];
  vp?: Maybe<Scalars['Float']['output']>;
  vp_by_strategy?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  vp_state?: Maybe<Scalars['String']['output']>;
};

export type VoteWhere = {
  app?: InputMaybe<Scalars['String']['input']>;
  app_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  app_not?: InputMaybe<Scalars['String']['input']>;
  app_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  created?: InputMaybe<Scalars['Int']['input']>;
  created_gt?: InputMaybe<Scalars['Int']['input']>;
  created_gte?: InputMaybe<Scalars['Int']['input']>;
  created_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  created_lt?: InputMaybe<Scalars['Int']['input']>;
  created_lte?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ipfs?: InputMaybe<Scalars['String']['input']>;
  ipfs_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  proposal?: InputMaybe<Scalars['String']['input']>;
  proposal_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  reason?: InputMaybe<Scalars['String']['input']>;
  reason_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  reason_not?: InputMaybe<Scalars['String']['input']>;
  reason_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  space?: InputMaybe<Scalars['String']['input']>;
  space_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  voter?: InputMaybe<Scalars['String']['input']>;
  voter_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  vp?: InputMaybe<Scalars['Float']['input']>;
  vp_gt?: InputMaybe<Scalars['Float']['input']>;
  vp_gte?: InputMaybe<Scalars['Float']['input']>;
  vp_in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  vp_lt?: InputMaybe<Scalars['Float']['input']>;
  vp_lte?: InputMaybe<Scalars['Float']['input']>;
  vp_state?: InputMaybe<Scalars['String']['input']>;
  vp_state_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type Vp = {
  __typename?: 'Vp';
  vp?: Maybe<Scalars['Float']['output']>;
  vp_by_strategy?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  vp_state?: Maybe<Scalars['String']['output']>;
};

export type VotingPowerQueryVariables = Exact<{
  voter: Scalars['String']['input'];
  space: Scalars['String']['input'];
}>;


export type VotingPowerQuery = { __typename?: 'Query', vp?: { __typename?: 'Vp', vp?: number | null, vp_by_strategy?: Array<number | null> | null, vp_state?: string | null } | null };

export type DelegateProfilePageQueryQueryVariables = Exact<{
  voter: Scalars['String']['input'];
  space: Scalars['String']['input'];
  proposal?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<VoteWhere>;
}>;


export type DelegateProfilePageQueryQuery = { __typename?: 'Query', votes?: Array<{ __typename?: 'Vote', id: string, choice: any, voter: string, reason?: string | null, metadata?: any | null, created: number, ipfs?: string | null, vp?: number | null, vp_by_strategy?: Array<number | null> | null, vp_state?: string | null, proposal?: { __typename?: 'Proposal', id: string, title: string, body?: string | null, choices: Array<string | null> } | null } | null> | null, vp?: { __typename?: 'Vp', vp?: number | null, vp_by_strategy?: Array<number | null> | null, vp_state?: string | null } | null };

export type DelegateProposalsQueryVariables = Exact<{
  space: Scalars['String']['input'];
}>;


export type DelegateProposalsQuery = { __typename?: 'Query', proposals?: Array<{ __typename?: 'Proposal', id: string, title: string, choices: Array<string | null>, start: number, end: number, snapshot?: string | null, state?: string | null, scores?: Array<number | null> | null, scores_total?: number | null, author: string, space?: { __typename?: 'Space', id: string, name?: string | null } | null } | null> | null };

export type GetSpaceQueryQueryVariables = Exact<{
  space: Scalars['String']['input'];
}>;


export type GetSpaceQueryQuery = { __typename?: 'Query', space?: { __typename?: 'Space', name?: string | null, about?: string | null, network?: string | null, symbol?: string | null, website?: string | null, private?: boolean | null, admins?: Array<string | null> | null, moderators?: Array<string | null> | null, members?: Array<string | null> | null, categories?: Array<string | null> | null, plugins?: any | null, children?: Array<{ __typename?: 'Space', name?: string | null } | null> | null, voting?: { __typename?: 'SpaceVoting', hideAbstain?: boolean | null } | null, strategies?: Array<{ __typename?: 'Strategy', name: string, network?: string | null, params?: any | null } | null> | null, validation?: { __typename?: 'Validation', name: string, params?: any | null } | null, voteValidation?: { __typename?: 'Validation', name: string, params?: any | null } | null, filters?: { __typename?: 'SpaceFilters', minScore?: number | null, onlyMembers?: boolean | null } | null, treasuries?: Array<{ __typename?: 'Treasury', name?: string | null, address?: string | null, network?: string | null } | null> | null } | null };

export type ProposalQueryVariables = Exact<{
  proposal?: InputMaybe<Scalars['String']['input']>;
}>;


export type ProposalQuery = { __typename?: 'Query', proposal?: { __typename?: 'Proposal', id: string, author: string, title: string, body?: string | null, choices: Array<string | null>, votes?: number | null, scores?: Array<number | null> | null, start: number, end: number, state?: string | null, discussion: string, ipfs?: string | null, type?: string | null, scores_by_strategy?: any | null, scores_state?: string | null, scores_total?: number | null, scores_updated?: number | null, snapshot?: string | null, strategies: Array<{ __typename?: 'Strategy', network?: string | null, params?: any | null } | null> } | null };

export type VpQueryVariables = Exact<{
  voter: Scalars['String']['input'];
  space: Scalars['String']['input'];
  proposal?: InputMaybe<Scalars['String']['input']>;
}>;


export type VpQuery = { __typename?: 'Query', vp?: { __typename?: 'Vp', vp?: number | null, vp_by_strategy?: Array<number | null> | null, vp_state?: string | null } | null };

export type VoteQueryVariables = Exact<{
  where?: InputMaybe<VoteWhere>;
}>;


export type VoteQuery = { __typename?: 'Query', votes?: Array<{ __typename?: 'Vote', choice: any, voter: string, reason?: string | null, metadata?: any | null, created: number, ipfs?: string | null, vp?: number | null, vp_by_strategy?: Array<number | null> | null, vp_state?: string | null } | null> | null };

export type VotingProposalsVotesQueryVariables = Exact<{
  where?: InputMaybe<VoteWhere>;
}>;


export type VotingProposalsVotesQuery = { __typename?: 'Query', votes?: Array<{ __typename?: 'Vote', choice: any, voter: string, reason?: string | null, metadata?: any | null, created: number, ipfs?: string | null, vp?: number | null, vp_by_strategy?: Array<number | null> | null, vp_state?: string | null } | null> | null };


export const VotingPowerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VotingPower"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"voter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"space"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"voter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"voter"}}},{"kind":"Argument","name":{"kind":"Name","value":"space"},"value":{"kind":"Variable","name":{"kind":"Name","value":"space"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vp"}},{"kind":"Field","name":{"kind":"Name","value":"vp_by_strategy"}},{"kind":"Field","name":{"kind":"Name","value":"vp_state"}}]}}]}}]} as unknown as DocumentNode<VotingPowerQuery, VotingPowerQueryVariables>;
export const DelegateProfilePageQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DelegateProfilePageQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"voter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"space"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"proposal"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"VoteWhere"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"votes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"choice"}},{"kind":"Field","name":{"kind":"Name","value":"voter"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"proposal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"choices"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ipfs"}},{"kind":"Field","name":{"kind":"Name","value":"vp"}},{"kind":"Field","name":{"kind":"Name","value":"vp_by_strategy"}},{"kind":"Field","name":{"kind":"Name","value":"vp_state"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"voter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"voter"}}},{"kind":"Argument","name":{"kind":"Name","value":"space"},"value":{"kind":"Variable","name":{"kind":"Name","value":"space"}}},{"kind":"Argument","name":{"kind":"Name","value":"proposal"},"value":{"kind":"Variable","name":{"kind":"Name","value":"proposal"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vp"}},{"kind":"Field","name":{"kind":"Name","value":"vp_by_strategy"}},{"kind":"Field","name":{"kind":"Name","value":"vp_state"}}]}}]}}]} as unknown as DocumentNode<DelegateProfilePageQueryQuery, DelegateProfilePageQueryQueryVariables>;
export const DelegateProposalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DelegateProposals"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"space"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"proposals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"20"}},{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"IntValue","value":"0"}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"space_in"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"space"}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"StringValue","value":"created","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"choices"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"snapshot"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"scores"}},{"kind":"Field","name":{"kind":"Name","value":"scores_total"}},{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<DelegateProposalsQuery, DelegateProposalsQueryVariables>;
export const GetSpaceQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSpaceQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"space"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"space"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"space"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"about"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"admins"}},{"kind":"Field","name":{"kind":"Name","value":"moderators"}},{"kind":"Field","name":{"kind":"Name","value":"members"}},{"kind":"Field","name":{"kind":"Name","value":"categories"}},{"kind":"Field","name":{"kind":"Name","value":"plugins"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"voting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hideAbstain"}}]}},{"kind":"Field","name":{"kind":"Name","value":"strategies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"params"}}]}},{"kind":"Field","name":{"kind":"Name","value":"validation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"params"}}]}},{"kind":"Field","name":{"kind":"Name","value":"voteValidation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"params"}}]}},{"kind":"Field","name":{"kind":"Name","value":"filters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"minScore"}},{"kind":"Field","name":{"kind":"Name","value":"onlyMembers"}}]}},{"kind":"Field","name":{"kind":"Name","value":"treasuries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"network"}}]}}]}}]}}]} as unknown as DocumentNode<GetSpaceQueryQuery, GetSpaceQueryQueryVariables>;
export const ProposalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Proposal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"proposal"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"proposal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"proposal"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"choices"}},{"kind":"Field","name":{"kind":"Name","value":"votes"}},{"kind":"Field","name":{"kind":"Name","value":"scores"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"discussion"}},{"kind":"Field","name":{"kind":"Name","value":"ipfs"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"scores_by_strategy"}},{"kind":"Field","name":{"kind":"Name","value":"scores_state"}},{"kind":"Field","name":{"kind":"Name","value":"scores_total"}},{"kind":"Field","name":{"kind":"Name","value":"scores_updated"}},{"kind":"Field","name":{"kind":"Name","value":"snapshot"}},{"kind":"Field","name":{"kind":"Name","value":"strategies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"network"}},{"kind":"Field","name":{"kind":"Name","value":"params"}}]}}]}}]}}]} as unknown as DocumentNode<ProposalQuery, ProposalQueryVariables>;
export const VpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Vp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"voter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"space"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"proposal"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"voter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"voter"}}},{"kind":"Argument","name":{"kind":"Name","value":"space"},"value":{"kind":"Variable","name":{"kind":"Name","value":"space"}}},{"kind":"Argument","name":{"kind":"Name","value":"proposal"},"value":{"kind":"Variable","name":{"kind":"Name","value":"proposal"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vp"}},{"kind":"Field","name":{"kind":"Name","value":"vp_by_strategy"}},{"kind":"Field","name":{"kind":"Name","value":"vp_state"}}]}}]}}]} as unknown as DocumentNode<VpQuery, VpQueryVariables>;
export const VoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Vote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"VoteWhere"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"votes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"choice"}},{"kind":"Field","name":{"kind":"Name","value":"voter"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"ipfs"}},{"kind":"Field","name":{"kind":"Name","value":"vp"}},{"kind":"Field","name":{"kind":"Name","value":"vp_by_strategy"}},{"kind":"Field","name":{"kind":"Name","value":"vp_state"}}]}}]}}]} as unknown as DocumentNode<VoteQuery, VoteQueryVariables>;
export const VotingProposalsVotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VotingProposalsVotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"VoteWhere"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"votes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"choice"}},{"kind":"Field","name":{"kind":"Name","value":"voter"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"ipfs"}},{"kind":"Field","name":{"kind":"Name","value":"vp"}},{"kind":"Field","name":{"kind":"Name","value":"vp_by_strategy"}},{"kind":"Field","name":{"kind":"Name","value":"vp_state"}}]}}]}}]} as unknown as DocumentNode<VotingProposalsVotesQuery, VotingProposalsVotesQueryVariables>;