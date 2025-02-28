"use client";

import { useEffect, useRef, useState } from "react";

/** 일봉(Candle) 데이터 구조 예시 */
export interface DailyCandle {
  openTime: number;  // ms (Binance는 ms 단위)
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isClosed: boolean; // 해당 봉이 마감되었는지(x: true)
}

/** 훅 리턴값 인터페이스 */
interface UseDailyKlinesResult {
  dailyData: DailyCandle[];  // 일봉 배열 (과거 + 현재 진행 중 봉)
  isLoading: boolean;
  error: string | null;
}

/**
 * 특정 심볼(symbol)의 "일봉(1d)" 데이터를
 *  1) REST API로 과거 N개 로드
 *  2) WebSocket(@kline_1d)으로 당일봉 실시간 업데이트
 */
export function useDailyKlines(symbol: string, limit = 30): UseDailyKlinesResult {
  const [dailyData, setDailyData] = useState<DailyCandle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    let ws: WebSocket | null = null;
    
    async function init() {
      try {
        setIsLoading(true);
        setError(null);
        
        // -----------------------------------------
        // 1) REST: 과거 일봉 데이터 불러오기
        // -----------------------------------------
        // (Binance base url 예: https://api.binance.com)
        const url = `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=1d&limit=${limit}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to fetch daily klines for ${symbol}`);
        }
        const data = await res.json();
        // data 예시: [ [openTime, open, high, low, close, volume, closeTime, ...], [...], ... ]
        
        const initial: DailyCandle[] = data.map((item: any) => {
          const [openTime, o, h, l, c, v,,,,,] = item;
          return {
            openTime,
            open: parseFloat(o),
            high: parseFloat(h),
            low: parseFloat(l),
            close: parseFloat(c),
            volume: parseFloat(v),
            isClosed: false, // 뒤에서 처리
          };
        });
        
        // Binance 응답에서 일봉 마감 여부는 "closeTime" vs "openTime" 비교 가능
        // 여기서는 마지막 봉도 x=true인지 여부를 판별할 순 있으나,
        //  단순화해서 "지난 봉은 다 마감됐다고 간주"해서 처리
        // (UTC 0시에 마감된 것들)
        // 대충 마지막 봉도 본인 재량껏 처리 가능
        for (let i = 0; i < initial.length; i++) {
          // openTime vs closeTime 등 비교해서 isClosed = true
          // 예시로, "과거 봉"이면 isClosed=true로
          if (i < initial.length - 1) {
            initial[i].isClosed = true;
          }
        }
        
        setDailyData(initial);
        
        // -----------------------------------------
        // 2) WebSocket: 실시간 구독(@kline_1d)
        // -----------------------------------------
        ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_1d`);
        wsRef.current = ws;
        
        ws.onopen = () => {
          console.log(`Daily kline WebSocket connected: ${symbol}`);
        };
        
        ws.onmessage = (evt) => {
          try {
            const msg = JSON.parse(evt.data);
            if (msg.e === "kline" && msg.k) {
              // k: { t, T, s, i, o, c, h, l, v, x }
              const k = msg.k;
              // 1d 봉 정보
              const newCandle: DailyCandle = {
                openTime: k.t,                // ms
                open: parseFloat(k.o),
                high: parseFloat(k.h),
                low: parseFloat(k.l),
                close: parseFloat(k.c),
                volume: parseFloat(k.v),
                isClosed: k.x,               // 봉 마감 여부
              };
              
              setDailyData((prev) => {
                // prev의 마지막 봉을 확인
                if (prev.length === 0) {
                  return [newCandle];
                }
                const last = prev[prev.length - 1];
                
                // openTime 같다면 => 진행 중인 봉 업데이트
                if (last.openTime === newCandle.openTime) {
                  const updated = [...prev];
                  updated[updated.length - 1] = newCandle;
                  return updated;
                }
                // time이 더 크면 => 새 봉 추가
                else if (newCandle.openTime > last.openTime) {
                  // 지난 봉은 isClosed = true
                  const updatedLast = { ...last, isClosed: true };
                  const rest = [...prev.slice(0, -1), updatedLast];
                  
                  return [...rest, newCandle];
                }
                // 그 외(시간 역행 등)는 무시
                return prev;
              });
            }
          } catch (err) {
            console.error("Error parsing daily kline event:", err);
          }
        };
        
        ws.onerror = (err) => {
          console.error("Daily kline WebSocket error:", err);
          setError("WebSocket error");
        };
        
        ws.onclose = () => {
          console.log("Daily kline WebSocket closed");
        };
      } catch (err: any) {
        console.error("useDailyKlines init error:", err);
        setError(err.message || "Failed to load daily klines");
      } finally {
        setIsLoading(false);
      }
    }
    
    init();
    
    // cleanup
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      wsRef.current = null;
    };
  }, [symbol, limit]);
  
  return { dailyData, isLoading, error };
}
