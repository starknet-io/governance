import {
  starknetGoerli1,
  clients,
  getStarknetStrategy,
} from "@snapshot-labs/sx";

import { RpcProvider, constants } from "starknet";

const ethUrl = "https://rpcs.snapshotx.xyz/1";
const manaUrl = "https://mana.pizza";

export const starkProvider = new RpcProvider({
  nodeUrl: `https://starknet-goerli.infura.io/v3/${
    import.meta.env.VITE_APP_INFURA_API_KEY
  }`,
});


export const clientConfig = {
  starkProvider,
  manaUrl,
  ethUrl,
  networkConfig: starknetGoerli1,
};

export const starknetEvmClient = new clients.StarknetTx(clientConfig);
export const starkSigClient = new clients.StarknetSig(clientConfig);
export const evmClient = new clients.EthereumTx(clientConfig);
export const ethSigClient = new clients.EthereumSig(clientConfig);
