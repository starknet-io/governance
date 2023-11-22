import { defaultNetwork, getStarknetStrategy } from "@snapshot-labs/sx";
import { clientConfig } from "../../clients/clients";

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

export function getUrl(uri: string) {
  const IPFS_GATEWAY: string =
    import.meta.env.VITE_APP_IPFS_GATEWAY || "https://cloudflare-ipfs.com";
  const ipfsGateway = `https://${IPFS_GATEWAY}`;
  if (!uri) return null;
  if (
    !uri.startsWith("ipfs://") &&
    !uri.startsWith("ipns://") &&
    !uri.startsWith("https://") &&
    !uri.startsWith("http://")
  ) {
    return `${ipfsGateway}/ipfs/${uri}`;
  }

  const uriScheme = uri.split("://")[0];
  if (uriScheme === "ipfs")
    return uri.replace("ipfs://", `${ipfsGateway}/ipfs/`);
  if (uriScheme === "ipns")
    return uri.replace("ipns://", `${ipfsGateway}/ipns/`);
  return uri;
}

export const parseStrategyMetadata = async (metadata: string | null) => {
  if (metadata === null) return null;
  if (!metadata.startsWith("ipfs://")) return JSON.parse(metadata);

  const strategyUrl = getUrl(metadata);
  if (!strategyUrl) return null;

  const res = await fetch(strategyUrl);
  return res.json();
};

export const getVotingPowerCalculation = async (
  strategiesAddresses: string[],
  strategiesParams: any[],
  strategiesMetadata: any[],
  voterAddress: string,
  timestamp: number | null,
): Promise<any> => {
  return Promise.all(
    strategiesAddresses.map(async (address, i) => {
      const strategy = getStarknetStrategy(address, defaultNetwork);
      if (!strategy)
        return { address, value: 0n, decimals: 0, token: null, symbol: "" };

      const strategyMetadata = await parseStrategyMetadata(
        strategiesMetadata[i].payload,
      );

      const value = await strategy.getVotingPower(
        address,
        voterAddress,
        strategyMetadata,
        timestamp,
        strategiesParams[i].split(","),
        {
          ...clientConfig,
          networkConfig: defaultNetwork,
        },
      );

      return {
        address,
        value,
        decimals: strategiesMetadata[i]?.decimals ?? 0,
        symbol: strategiesMetadata[i]?.symbol ?? "",
        token: strategiesMetadata[i]?.token ?? null,
      };
    }),
  );
};
