import {BINANCE_URL} from "@/lib/constants";
import {MarketItem, UseMarketListOptions} from "@/types/market";
import {TickerData} from "@/types/ticker";

export const fetchMarkets = async ({ quoteAsset="USDT", onlyFavorites }: UseMarketListOptions) => {
  const tickerResponse = await fetch(`${BINANCE_URL}/ticker/24hr`);
  if (!tickerResponse.ok) {
    throw new Error(`마켓 정보를 가져오는데 실패했습니다: ${tickerResponse.status}`);
  }
  
  const tickerData = await tickerResponse.json();
  
  let favorites = [];
  if (typeof window !== 'undefined') {
    favorites = JSON.parse(localStorage.getItem('favoriteMarkets') || '[]');
  }
  
  const processedMarkets = tickerData
    .filter((ticker: TickerData) => ticker.symbol.endsWith(quoteAsset))
    .map((ticker: TickerData) => {
      const baseAsset = ticker.symbol.replace(quoteAsset, '');
      
      const leverage = '5x'; // 예시 데이터
      
      return {
        symbol: ticker.symbol,
        baseAsset,
        quoteAsset,
        lastPrice: ticker.lastPrice,
        priceChangePercent: ticker.priceChangePercent,
        volume: ticker.volume,
        leverage,
        isFavorite: favorites.includes(ticker.symbol)
      };
    })
    .sort((a: MarketItem, b: MarketItem) => b.priceChangePercent - a.priceChangePercent);
  
  return onlyFavorites
    ? processedMarkets.filter((m: MarketItem) => m.isFavorite)
    : processedMarkets;
};