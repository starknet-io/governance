import { createStateContext } from "react-use";

type HelpMessage =
  | "connectWalletMessage"
  | "connectStarknetWalletMessage"
  | "connectWalletErrorMessage"
  | "noVotingPowerMessage"
  | "emailSubscription"
  | null;

export const [useHelpMessage, HelpMessageProvider, HelpMessageContext] =
  createStateContext<HelpMessage>(null);
