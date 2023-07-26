import { createStateContext } from "react-use";

type HelpMessage =
  | "connectWalletMessage"
  | "connectWalletErrorMessage"
  | "noVotingPowerMessage"
  | null;

export const [useHelpMessage, HelpMessageProvider, HelpMessageContext] =
  createStateContext<HelpMessage>(null);
