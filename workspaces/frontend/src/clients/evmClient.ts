import { clients, evmGoerli } from '@snapshot-labs/sx';

const clientConfig = { networkConfig: evmGoerli }

export const evmClient = new clients.EthereumTx(clientConfig);
export const ethSigClient = new clients.EthereumSig(clientConfig);

