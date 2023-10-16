import React from "react";
import { HelpMessageProvider } from "src/hooks/HelpMessage";

type Props = {
  children: React.ReactNode;
};

export const MessagesProvider = ({ children }: Props) => {
  return <HelpMessageProvider>{children}</HelpMessageProvider>;
};
