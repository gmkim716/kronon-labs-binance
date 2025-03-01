import {Time} from "lightweight-charts";

export interface CandleData {
  time: Time;  // 초 단위 timestamp (Lightweight Charts 권장)
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface UseChartDataResult {
  candles: CandleData[];
  isLoading: boolean;
  error: string | null;
}

export interface UseChartWebSocketOptions {
  symbol: string;
  interval: string;
  initialData: CandleData[];
  enabled?: boolean;
}

export interface UseChartWebSocketResult {
  candles: CandleData[];
  isConnected: boolean;
  error: string | null;
  reconnect: () => void;
}
