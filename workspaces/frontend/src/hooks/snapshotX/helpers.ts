import { defaultNetwork, getStarknetStrategy } from "@snapshot-labs/sx";
import { clientConfig, starkProvider as provider } from "../../clients/clients";
import {
  constants as starknetConstants,
  TransactionExecutionStatus,
  TransactionFinalityStatus,
} from "starknet";
import { create } from "ipfs-http-client";
import { pin } from "@snapshot-labs/pineapple";
import {STRATEGIES_ENUM} from "./constants";

const client = create({ url: "https://api.thegraph.com/ipfs/api/v0" });

export const waitForTransaction = async (txId: string) => {
  let retries = 0;

  return new Promise((resolve, reject) => {
    const timer = setInterval(async () => {
      let tx: Awaited<ReturnType<typeof provider.getTransactionReceipt>>;
      try {
        tx = await provider.getTransactionReceipt(txId);
      } catch (e) {
        if (retries > 20) {
          clearInterval(timer);
          reject();
        }

        retries++;

        return;
      }

      const successStates = [
        TransactionFinalityStatus.ACCEPTED_ON_L1,
        TransactionFinalityStatus.ACCEPTED_ON_L2,
      ];

      if (successStates.includes(tx.finality_status as any)) {
        clearInterval(timer);
        resolve(tx);
      }

      if (tx.execution_status === TransactionExecutionStatus.REVERTED) {
        clearInterval(timer);
        reject(tx);
      }
    }, 2000);
  });
};

export async function pinGraph(payload: any) {
  const res = await client.add(JSON.stringify(payload), { pin: true });

  return {
    provider: "graph",
    cid: res.cid.toV0().toString(),
  };
}

export async function pinPineapple(payload: any) {
  const pinned = await pin(payload);
  if (!pinned) throw new Error("Failed to pin");

  return {
    provider: pinned.provider,
    cid: pinned.cid,
  };
}

export const transformProposalData = (data) => {
  if (data && data.proposals && data.proposals.length) {
    return data.proposals.map((proposal) => transformProposal(proposal));
  } else {
    return data;
  }
};

function getProposalState(proposal: any, current: number) {
  if (proposal.executed) return "executed";
  if (proposal.max_end * 1000 <= current) {
    return "closed";
  }
  if (proposal.start * 1000 > current) return "pending";

  return "active";
}

export const transformProposal = (proposal) => {
  const timeNow = Date.now();
  return {
    ...proposal,
    ...proposal.metadata,
    author: proposal.author.id,
    end: proposal.max_end,
    id: proposal.proposal_id,
    ipfs: proposal?.metadata?.id,
    choices: ["For", "Against", "Abstain"],
    ipfs: proposal.metadata.id,
    scores: [
      parseFloat(proposal.scores_1),
      parseFloat(proposal.scores_2),
      parseFloat(proposal.scores_3),
    ],
    state: getProposalState(proposal, timeNow),
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
    return data?.votes || [];
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

export const prepareStrategiesForSignature = async (
  strategies: string[],
  strategiesMetadata: any[],
) => {
  const strategiesWithMetadata = await Promise.all(
    strategies.map(async (strategy, i) => {
      const metadata = await parseStrategyMetadata(
        strategiesMetadata[i].payload,
      );

      return {
        address: strategy,
        index: i,
        metadata,
      };
    }),
  );
  return strategiesWithMetadata;
};

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

export const parseStrategiesToHumanReadableFormat = (strategies = []) => {
  console.log(strategies)
  return strategies.map((strategy) => {
    if (STRATEGIES_ENUM?.[strategy]) {
      return STRATEGIES_ENUM?.[strategy]
    } else {
      return ""
    }
  })
}

export const parseStrategiesMetadata = (strategies) => {
  return strategies.map((strategy) => {
    return `${strategy?.data?.name} - ${strategy?.data?.symbol}`
  })
}
