import React, { createContext, useState, ReactNode } from "react";

export interface BalanceInfo {
  balance: string;
  rawBalance: string;
  decimals: number;
  symbol: string;
  address: string;
}

interface BalanceContextType {
  balance: BalanceInfo | null;
  setBalance: (balance: BalanceInfo | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: Error | null;
  setError: (error: Error | null) => void;
}

export const BalanceContext = createContext<BalanceContextType | undefined>(
  undefined,
);

interface BalanceProviderProps {
  children: ReactNode;
}

export const BalanceProvider: React.FC<BalanceProviderProps> = ({
  children,
}) => {
  const [balance, setBalance] = useState<BalanceInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const value: BalanceContextType = {
    balance,
    setBalance,
    loading,
    setLoading,
    error,
    setError,
  };

  return (
    <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>
  );
};

// Optionally, if you still want to provide a custom hook for consuming the context,
// which is a recommended pattern for ease of use and encapsulation:
export const useBalance = (): BalanceContextType => {
  const context = React.useContext(BalanceContext);
  if (context === undefined) {
    throw new Error("useBalance must be used within a BalanceProvider");
  }
  return context;
};
