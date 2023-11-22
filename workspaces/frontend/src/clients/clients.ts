import { clients } from "@snapshot-labs/sx";
import { Provider, constants } from "starknet";

const ethUrl = "https://rpcs.snapshotx.xyz/1";
const manaUrl = "https://mana.pizza";

const starkProvider = new Provider({
  sequencer: { network: constants.NetworkName.SN_GOERLI },
});

const clientConfig = {
  starkProvider,
  manaUrl,
  ethUrl,
};

export const starknetEvmClient = new clients.StarkNetTx(clientConfig);
export const starkSigClient = new clients.StarkNetSig(clientConfig);
export const evmClient = new clients.EthereumTx(clientConfig);
export const ethSigClient = new clients.EthereumSig(clientConfig);
