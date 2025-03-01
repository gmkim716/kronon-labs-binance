export interface TickerData {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  volume: string;
  [key: string]: any;     // 기타 속성
}