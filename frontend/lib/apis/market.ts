import {MarketItem} from "@/lib/hooks/useMarketList";

export interface UseMarketListOptions {
  quoteAsset?: string;
  onlyFavorites?: boolean;
}

export const fetchMarketList = async (options: UseMarketListOptions = {}): Promise<MarketItem[]> => {
  const { quoteAsset = '', onlyFavorites = false } = options;
  
  
  
  
}