"use client";

import {useEffect, useState} from "react";
import {CandleData, UseChartDataResult} from "@/types/chart";
import {fetchCandleData} from "@/apis/chart";
import {useChartWebSocket} from "@/lib/hooks/useChartWebSocket";

export function useChart(symbol: string, interval: string, limit: number): UseChartDataResult {
  const [initialCandles, setInitialCandles] = useState<CandleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true);
        setFetchError(null);
        
        const data = await fetchCandleData(symbol, interval, limit);
        setInitialCandles(data);
      } catch (err: any) {
        console.error("Failed to fetch initial chart data:", err);
        setFetchError(err.message || "Failed to load chart data");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadInitialData();
  }, [symbol, interval, limit]);
  
  const {
    candles,
    isConnected,
    error: wsError,
  } = useChartWebSocket({
    symbol,
    interval,
    initialData: initialCandles,
    enabled: !isLoading && !fetchError && initialCandles.length > 0,
  });
  
  const error = fetchError || wsError;
  
  return {
    candles,
    isLoading,
    error
  };
}