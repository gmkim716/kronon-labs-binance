import {BINANCE_URL} from "@/lib/constants";
import {TickerData} from "@/lib/hooks/useTicker";
import {MarketItem} from "@/types/market";

export interface UseMarketListOptions {
  quoteAsset?: string;
  onlyFavorites?: boolean;
}

export const fetchMarkets = async ({ quoteAsset="USDT", onlyFavorites }: UseMarketListOptions) => {
  // 티커 정보 가져오기
  const tickerResponse = await fetch(`${BINANCE_URL}/ticker/24hr`);
  if (!tickerResponse.ok) {
    throw new Error(`마켓 정보를 가져오는데 실패했습니다: ${tickerResponse.status}`);
  }
  
  const tickerData = await tickerResponse.json();
  
  let favorites = [];
  if (typeof window !== 'undefined') {
    // 클라이언트 사이드일 때만 localStorage 접근
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
    // 가격 변동률로 정렬 (선택사항)
    .sort((a: MarketItem, b: MarketItem) => b.priceChangePercent - a.priceChangePercent);
  
  // 즐겨찾기 필터링
  return onlyFavorites
    ? processedMarkets.filter((m: MarketItem) => m.isFavorite)
    : processedMarkets;
};