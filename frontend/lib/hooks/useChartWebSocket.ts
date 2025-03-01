"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { BINANCE_WEBSOCKET } from "@/lib/constants";
import {CandleData, UseChartWebSocketOptions, UseChartWebSocketResult} from "@/types/chart";
import { Time } from "lightweight-charts";


export function useChartWebSocket({
                                    symbol,
                                    interval,
                                    initialData,
                                    enabled = true,
                                  }: UseChartWebSocketOptions): UseChartWebSocketResult {
  const [candles, setCandles] = useState<CandleData[]>(initialData);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  
  const connectWebSocket = useCallback(() => {
    if (!enabled) return;
    
    if (ws.current) {
      ws.current.close();
    }
    
    setError(null);
    
    try {
      ws.current = new WebSocket(
        `${BINANCE_WEBSOCKET}/${symbol.toLowerCase()}@kline_${interval}`
      );
      
      ws.current.onopen = () => {
        console.log(`Kline WebSocket connected: ${symbol}, ${interval}`);
        setIsConnected(true);
      };
      
      ws.current.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data);
          if (msg.e === "kline" && msg.k) {
            const k = msg.k;
            const newCandle: CandleData = {
              time: k.t / 1000 as Time,
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
                const updated = [...prev];
                updated[updated.length - 1] = newCandle;
                return updated;
              } else if (newCandle.time > last.time) {
                return [...prev, newCandle];
              }
              return prev;
            });
          }
        } catch (err) {
          console.error("WebSocket parse error:", err);
        }
      };
      
      ws.current.onerror = (err) => {
        console.error("WebSocket error:", err);
        setError("WebSocket error");
        setIsConnected(false);
      };
      
      ws.current.onclose = () => {
        console.log("Kline WebSocket closed");
        setIsConnected(false);
        
        setTimeout(() => {
          if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
            connectWebSocket();
          }
        }, 3000);
      };
    } catch (err) {
      setError(`차트 연결 오류: ${err}`);
      setIsConnected(false);
    }
  }, [symbol, interval, enabled]);
  
  useEffect(() => {
    setCandles(initialData);
  }, [initialData]);
  
  useEffect(() => {
    if (enabled) {
      connectWebSocket();
    }
    
    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [symbol, interval, enabled, connectWebSocket]);
  
  return {
    candles,
    isConnected,
    error,
    reconnect: connectWebSocket,
  };
}