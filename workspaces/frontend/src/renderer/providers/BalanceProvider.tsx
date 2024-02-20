import {createContext, useContext, useRef, useState} from "react";

export interface BalanceInfo {
  balance: string;
  rawBalance: string;
  decimals: number;
  symbol: string;
  address: string;
}

interface BalanceContextType {
  balances: { [key: string]: BalanceInfo | null };
  setBalances: (
    updateFn: (prevBalances: { [key: string]: BalanceInfo | null }) => {
      [key: string]: BalanceInfo | null;
    },
  ) => void;
  loading: boolean;
  isFetching: { [key: string]: boolean };
  updateIsFetching: (key: string, value: boolean) => void;
  setLoading: (loading: boolean) => void;
  error: Error | null;
  setError: (error: Error | null) => void;
}

export const BalanceContext = createContext<BalanceContextType | undefined>(
  undefined,
);

export const BalanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [balances, setBalances] = useState<{ [key: string]: BalanceInfo }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const isFetching = useRef<{ [key: string]: boolean }>({});

  const value = {
    balances,
    setBalances,
    loading,
    setLoading,
    error,
    setError,
    isFetching: isFetching.current,
  };

  console.log(isFetching.current)

  return (
    <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>
  );
};

export const useBalance = (): BalanceContextType => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error("useBalance must be used within a BalanceProvider");
  }
  return context;
};
