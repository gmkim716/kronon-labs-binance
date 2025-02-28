import {Time} from "lightweight-charts";

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
