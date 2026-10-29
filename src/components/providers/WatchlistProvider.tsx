"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { normalizeWatchlist } from "@/lib/dashboard-logic.mjs";

type WatchlistContextValue = {
  items: string[];
  addItem: (item: string) => void;
  removeItem: (item: string) => void;
  toggleItem: (item: string) => void;
  isWatched: (item: string) => boolean;
};

const STORAGE_KEY = "intelligence-dashboard:watchlist";
const WatchlistContext = createContext<WatchlistContextValue | null>(null);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(normalizeWatchlist(JSON.parse(stored)));
      }
    } catch {
      // Storage can be unavailable or contain invalid data; keep the in-memory list.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // The watchlist remains usable for this session if storage is unavailable.
    }
  }, [hydrated, items]);

  const addItem = (item: string) => {
    const normalized = item.trim();
    if (!normalized) return;
    setItems((prev) => (prev.includes(normalized) ? prev : [...prev, normalized]));
  };

  const removeItem = (item: string) => {
    setItems((prev) => prev.filter((entry) => entry !== item));
  };

  const toggleItem = (item: string) => {
    const normalized = item.trim();
    if (!normalized) return;
    setItems((prev) =>
      prev.includes(normalized)
        ? prev.filter((entry) => entry !== normalized)
        : [...prev, normalized],
    );
  };

  const isWatched = (item: string) => items.includes(item);

  return (
    <WatchlistContext.Provider value={{ items, addItem, removeItem, toggleItem, isWatched }}>
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
