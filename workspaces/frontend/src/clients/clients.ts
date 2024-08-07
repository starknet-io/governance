import {
  clients,
  starknetMainnet,
} from "@snapshot-labs/sx";

import { RpcProvider, constants } from "starknet";

const ethUrl = `https://mainnet.infura.io/v3/${import.meta.env.VITE_APP_INFURA_API_KEY}`;
const manaUrl = "https://mana.box";

export const starkProvider = new RpcProvider({
  nodeUrl: `https://starknet-mainnet.infura.io/v3/${
    import.meta.env.VITE_APP_INFURA_API_KEY
  }`,
});

export const clientConfig = {
  starkProvider,
  manaUrl,
  ethUrl,
  networkConfig: starknetMainnet,
};

export const starknetEvmClient = new clients.StarknetTx(clientConfig);
export const starkSigClient = new clients.StarknetSig(clientConfig);
export const evmClient = new clients.EthereumTx(clientConfig);
export const ethSigClient = new clients.EthereumSig(clientConfig);
