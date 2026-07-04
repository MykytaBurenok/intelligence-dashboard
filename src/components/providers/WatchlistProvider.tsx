"use client";

import { createContext, useContext, useState } from "react";

type WatchlistContextValue = {
  items: string[];
  addItem: (item: string) => void;
  removeItem: (item: string) => void;
  toggleItem: (item: string) => void;
  isWatched: (item: string) => boolean;
};

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([]);

  const addItem = (item: string) => {
    setItems((prev) => (prev.includes(item) ? prev : [...prev, item]));
  };

  const removeItem = (item: string) => {
    setItems((prev) => prev.filter((entry) => entry !== item));
  };

  const toggleItem = (item: string) => {
    setItems((prev) =>
      prev.includes(item)
        ? prev.filter((entry) => entry !== item)
        : [...prev, item],
    );
  };

  const isWatched = (item: string) => items.includes(item);

  return (
    <WatchlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        toggleItem,
        isWatched,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);

  if (!context) {
    throw new Error("useWatchlist must be used within WatchlistProvider");
  }

  return context;
}
