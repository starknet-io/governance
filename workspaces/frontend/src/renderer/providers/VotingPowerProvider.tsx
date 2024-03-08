// src/contexts/VotingPowerProvider.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
} from "react";

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
  addActiveCacheKey: (key: string) => boolean;
  removeActiveCacheKey: (key: string) => void;
  isFetching: { [key: string]: boolean };
}

export const VotingPowerContext = createContext<
  VotingPowerContextType | undefined
>(undefined);

export const VotingPowerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [votingPowerData, setVotingPowerData] = useState<VotingPowerData>({});
  const activeCacheKeys = useRef(new Set<string>());
  const isFetching = useRef<{ [key: string]: boolean }>({});
  const addActiveCacheKey = (key: string): boolean => {
    if (activeCacheKeys.current.has(key)) {
      return false;
    }
    activeCacheKeys.current.add(key);
    return true;
  };

  const removeActiveCacheKey = (key: string) => {
    activeCacheKeys.current.delete(key);
  };
  const value = {
    votingPowerData,
    setVotingPowerData,
    addActiveCacheKey,
    removeActiveCacheKey,
    isFetching: isFetching.current,
  };
  return (
    <VotingPowerContext.Provider value={value}>
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
