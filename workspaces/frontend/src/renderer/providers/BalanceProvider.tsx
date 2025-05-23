// BalanceProvider.js

import React, { createContext, useContext, useRef, useState } from 'react';

export interface BalanceInfo {
  balance: string;
  rawBalance: string;
  decimals: bigint;
  symbol: string;
  address: string;
}

interface BalanceContextType {
  balances: { [key: string]: BalanceInfo | null };
  setBalances: (updateFn: (prevBalances: { [key: string]: BalanceInfo | null }) => { [key: string]: BalanceInfo | null }) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isFetching: { [key: string]: boolean };
  error: Error | null;
  setError: (error: Error | null) => void;
  addActiveCacheKey: (key: string) => boolean;
  removeActiveCacheKey: (key: string) => void;
}

export const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balances, setBalances] = useState<{ [key: string]: BalanceInfo }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const activeCacheKeys = useRef(new Set());

  const isFetching = useRef<{ [key: string]: boolean }>({});


  const addActiveCacheKey = (key: string) => {
    const isNewKey = !activeCacheKeys.current.has(key);
    activeCacheKeys.current.add(key);
    return isNewKey;
  };

  const removeActiveCacheKey = (key: string) => {
    activeCacheKeys.current.delete(key);
  };

  const value = {
    balances,
    setBalances,
    loading,
    setLoading,
    error,
    setError,
    addActiveCacheKey,
    removeActiveCacheKey,
    isFetching: isFetching.current,
  };

  return <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>;
};

export const useBalance = (): BalanceContextType => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};
