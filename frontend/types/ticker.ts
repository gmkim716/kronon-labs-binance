export interface TickerData {
  symbol: string;
  lastPrice: number;
  priceChange: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  quoteVolume: number;
}

export interface UseTickerWebSocketOptions {
  symbol: string;
  enabled?: boolean;
  onTickerUpdate?: (data: TickerData, priceDirection: 'up' | 'down' | null) => void;
}

export interface UseTickerWebSocketResult {
  isConnected: boolean;
  error: string | null;
  reconnect: () => void;
}