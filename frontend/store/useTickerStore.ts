import {create} from "zustand/react";
import {TickerStore} from "@/types/orderbook";

export const useTickerStore = create<TickerStore>((set) => ({
  ticker: {},
  setTicker: (updater) => set((state) => ({ ticker: updater(state.ticker) })),
}));