// src/contexts/VotingPowerProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface VotingPowerData {
  [key: string]: {
    votingPower: number;
    isLoading: boolean;
    error?: Error;
  };
}

interface VotingPowerContextType {
  votingPowerData: VotingPowerData;
  setVotingPowerData: React.Dispatch<React.SetStateAction<VotingPowerData>>;
}

export const VotingPowerContext = createContext<
  VotingPowerContextType | undefined
>(undefined);

export const VotingPowerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [votingPowerData, setVotingPowerData] = useState<VotingPowerData>({});

  return (
    <VotingPowerContext.Provider
      value={{ votingPowerData, setVotingPowerData }}
    >
      {children}
    </VotingPowerContext.Provider>
  );
};

export const useVotingPowerContext = () => {
  const context = useContext(VotingPowerContext);
  if (context === undefined) {
    throw new Error(
      "useVotingPowerContext must be used within a VotingPowerProvider",
    );
  }
  return context;
};
