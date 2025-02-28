"use client";

import { useEffect, useState } from "react";

export interface TradeData {
  time: number; // 초 단위 timestamp
  price: number;
  quantity: number;
  isBuyerMaker: boolean;
}

interface UseTradeDataResult {
  trades: TradeData[];
  isLoading: boolean;
  error: string | null;
}

export function useTradeData(symbol: string): UseTradeDataResult {
  const [trades, setTrades] = useState<TradeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let ws: WebSocket | null = null;
    
    function init() {
      setIsLoading(true);
      setError(null);
      
      ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`
      );
      
      ws.onopen = () => {
        console.log(`Trade WebSocket connected: ${symbol}`);
        setIsLoading(false);
      };
      
      ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data);
          if (msg.e === "trade") {
            const trade: TradeData = {
              time: msg.T / 1000, // ms 단위를 초 단위로 변환
              price: parseFloat(msg.p),
              quantity: parseFloat(msg.q),
              isBuyerMaker: msg.m,
            };
            
            // 새로운 체결 데이터를 기존 배열에 추가 (필요에 따라 배열 길이 제한 등 추가 가능)
            setTrades((prev) => [...prev, trade]);
          }
        } catch (err) {
          console.error("Trade WebSocket parse error:", err);
        }
      };
      
      ws.onerror = (err) => {
        console.error("Trade WebSocket error:", err);
        setError("Trade WebSocket error");
      };
      
      ws.onclose = () => {
        console.log("Trade WebSocket closed");
      };
    }
    
    init();
    
    // 컴포넌트 언마운트 시 WebSocket 정리
    return () => {
      if (ws) {
        ws.close();
        ws = null;
      }
    };
  }, [symbol]);
  
  return { trades, isLoading, error };
}
