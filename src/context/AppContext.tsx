'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { UserProfile, GameState, Asset } from '@/data/mock-data';
import { mockUser, mockAssets, mockOpponent as defaultOpponent } from '@/data/mock-data';

export type TradingMode = 'Stock' | 'Options';

export type Investment = {
  assetId: string;
  amount: number;
};

interface AppContextType {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  tradingMode: TradingMode;
  setTradingMode: (mode: TradingMode) => void;
  balance: number;
  setBalance: (balance: number) => void;
  investments: Investment[];
  setInvestments: (investments: Investment[]) => void;
  gameState: GameState;
  setGameState: (state: GameState) => void;
  assets: Asset[];
  opponent: UserProfile | null;
  setOpponent: (opponent: UserProfile | null) => void;
  cart: string[];
  setCart: (cart: string[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [tradingMode, setTradingMode] = useState<TradingMode>('Stock');
  const [balance, setBalance] = useState<number>(100000);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [gameState, setGameState] = useState<GameState>('Lobby');
  const [assets] = useState<Asset[]>(mockAssets);
  const [opponent, setOpponent] = useState<UserProfile | null>(defaultOpponent);
  const [cart, setCart] = useState<string[]>([]);

  const value = {
    user,
    setUser,
    tradingMode,
    setTradingMode,
    balance,
    setBalance,
    investments,
    setInvestments,
    gameState,
    setGameState,
    assets,
    opponent,
    setOpponent,
    cart,
    setCart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
