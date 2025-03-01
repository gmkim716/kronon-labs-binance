"use client";

import { BINANCE_URL } from "@/lib/constants";
import { CandleData } from "@/types/chart";
import { Time } from "lightweight-charts";


export async function fetchCandleData(
  symbol: string,
  interval: string,
  limit: number
): Promise<CandleData[]> {
  const res = await fetch(
    `${BINANCE_URL}/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`
  );
  
  if (!res.ok) {
    throw new Error(`Failed to fetch klines for ${symbol}`);
  }
  
  const data = await res.json();
  
  return data.map((k: any) => {
    const [openTime, o, h, l, c, v] = k;
    return {
      time: openTime / 1000 as Time, // ms -> 초 단위
      open: parseFloat(o),
      high: parseFloat(h),
      low: parseFloat(l),
      close: parseFloat(c),
      volume: parseFloat(v),
    };
  });
}