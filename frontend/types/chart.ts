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

export interface ChartPoint {
  time: Time;  // 타임스탬프
  open: number;  // 시가
  high: number;  // 고가
  low: number;   // 저가
  close: number; // 종가
  volume: number; // 거래량
}

export type Chart = ChartPoint[];

export interface OHLCProps {
  open:number;
  change:number;
  close: number;
  high: number;
  low: number;
  changePercent: number;
  time: string;
  amplitude: number;
}
