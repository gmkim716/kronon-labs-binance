"use client";

import { useEffect, useState, useRef } from "react";

export interface AggTrade {
  price: number;
  quantity: number;
  tradeTime: number;
  isBuyerMaker: boolean;
  // 필요 시 더 추가
}

/**
 * 실시가능로 누적된 거래, 거래량을 볼수 있는 소켓 연결 데이터 훅
 * @param symbol
 */
export function useAggTrade(symbol: string) {
  const [trades, setTrades] = useState<AggTrade[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    // WebSocket 연결
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@aggTrade`);
    wsRef.current = ws;
    
    ws.onopen = () => {
      console.log(`aggTrade WebSocket connected: ${symbol}`);
    };
    
    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg.e === "aggTrade") {
          const trade: AggTrade = {
            price: parseFloat(msg.p),
            quantity: parseFloat(msg.q),
            tradeTime: msg.T, // ms
            isBuyerMaker: msg.m,
          };
          // trades 리스트에 추가
          setTrades((prev) => [...prev, trade]);
        }
      } catch (err) {
        console.error("Error parsing aggTrade:", err);
      }
    };
    
    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
    
    ws.onclose = () => {
      console.log("aggTrade WebSocket closed");
    };
    
    // cleanup
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [symbol]);
  
  return { trades };
}
