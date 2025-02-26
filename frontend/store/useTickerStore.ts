import {create} from "zustand/react";

interface TickerData {
  s: string; // 심볼
  c: string; // 현재 가격
  P: string; // 24시간 변동률(%)
}

interface TickerStore {
  ticker: Record<string, TickerData>;
  setTicker: (updater: (prev: Record<string, TickerData>) => Record<string, TickerData>) => void;
}

export const useTickerStore = create<TickerStore>((set) => ({
  ticker: {},
  setTicker: (updater) => set((state) => ({ ticker: updater(state.ticker) })),
}));