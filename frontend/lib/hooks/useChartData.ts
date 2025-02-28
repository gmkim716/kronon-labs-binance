"use client";

import { useEffect, useState } from "react";
import {Time} from "lightweight-charts";

// 1) 봉(캔들) 데이터 타입
export interface CandleData {
  time: Time;  // 초 단위 timestamp (Lightweight Charts 권장)
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// 2) 반환되는 훅 결과
interface UseChartDataResult {
  candles: CandleData[];
  isLoading: boolean;
  error: string | null;
}

/**
 * 심볼(symbol), 인터벌(interval), 개수(limit)를 받아
 *  1) REST로 과거 봉 데이터를 가져오고
 *  2) WebSocket으로 새 봉/진행 중 봉을 실시간 업데이트
 * 를 하나로 관리하는 훅
 */
export function useChartData(symbol: string, interval: string, limit: number): UseChartDataResult {
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let ws: WebSocket | null = null;
    
    async function init() {
      try {
        setIsLoading(true);
        setError(null);
        
        // -----------------------------
        // 1) REST로 과거 봉 데이터 가져오기
        // -----------------------------
        const res = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch klines for ${symbol}`);
        }
        const data = await res.json();
        // data 구조: [ [openTime, open, high, low, close, volume, ...], ... ]
        
        const initialCandles: CandleData[] = data.map((k: any) => {
          const [openTime, o, h, l, c, v] = k;
          return {
            time: openTime / 1000, // ms -> 초 단위
            open: parseFloat(o),
            high: parseFloat(h),
            low: parseFloat(l),
            close: parseFloat(c),
            volume: parseFloat(v),
          };
        });
        setCandles(initialCandles);
        
        // -----------------------------
        // 2) WebSocket 실시간 업데이트
        // -----------------------------
        ws = new WebSocket(
          `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`
        );
        
        ws.onopen = () => {
          console.log(`Kline WebSocket connected: ${symbol}, ${interval}`);
        };
        
        ws.onmessage = (evt) => {
          try {
            const msg = JSON.parse(evt.data);
            // 예) { e: "kline", E: ..., s: "BTCUSDT", k: {...} }
            if (msg.e === "kline" && msg.k) {
              const k = msg.k;
              // 진행 중인 봉 (time이 같으면 교체, 크면 새 봉)
              const newCandle: CandleData = {
                time: k.t,
                open: parseFloat(k.o),
                high: parseFloat(k.h),
                low: parseFloat(k.l),
                close: parseFloat(k.c),
                volume: parseFloat(k.v),
              };
              
              setCandles((prev) => {
                if (prev.length === 0) return [newCandle];
                
                const last = prev[prev.length - 1];
                if (last.time === newCandle.time) {
                  // time이 동일 => 기존 봉 업데이트
                  const updated = [...prev];
                  updated[updated.length - 1] = newCandle;
                  return updated;
                } else if (newCandle.time > last.time) {
                  // 새 봉
                  return [...prev, newCandle];
                }
                // 그 외(시간 역행 등) => 무시
                return prev;
              });
            }
          } catch (err) {
            console.error("WebSocket parse error:", err);
          }
        };
        
        ws.onerror = (err) => {
          console.error("WebSocket error:", err);
          setError("WebSocket error");
        };
        
        ws.onclose = () => {
          console.log("Kline WebSocket closed");
        };
      } catch (err: any) {
        console.error("Failed to init chart data:", err);
        setError(err.message || "Failed to load chart data");
      } finally {
        setIsLoading(false);
      }
    }
    
    init();
    
    // 컴포넌트 언마운트 시 WebSocket 정리
    return () => {
      if (ws) {
        ws.close();
        ws = null;
      }
    };
  }, [symbol, interval, limit]);
  
  return { candles, isLoading, error };
}
