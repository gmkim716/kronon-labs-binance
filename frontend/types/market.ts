// 마켓 항목 타입 정의
export interface MarketItem {
  symbol: string;         // 심볼 (BTCUSDT)
  baseAsset: string;      // 기초 자산 (BTC)
  quoteAsset: string;     // 견적 자산 (USDT)
  lastPrice: number;      // 마지막 가격
  priceChangePercent: number; // 24시간 변동률
  leverage?: string;      // 레버리지 (5x)
  isFavorite?: boolean;   // 즐겨찾기 여부
  volume?: number;  // 야
}
