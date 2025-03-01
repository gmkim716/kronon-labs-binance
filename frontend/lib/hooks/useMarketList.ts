'use client';

import {useQuery} from "@tanstack/react-query";
import {fetchMarkets, UseMarketListOptions} from "@/apis/markets";
import {MarketItem} from "@/types/market";

export function useMarketList(options: UseMarketListOptions = {}) {
  const { quoteAsset = 'USDT', onlyFavorites = false } = options;
  
  return useQuery<MarketItem[], Error>({
    queryKey: ['markets', quoteAsset, onlyFavorites],
    queryFn: () => fetchMarkets({ quoteAsset, onlyFavorites }),
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
    staleTime: 30000,
  });
}