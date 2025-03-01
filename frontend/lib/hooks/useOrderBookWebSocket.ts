'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {useQueryClient} from "@tanstack/react-query";
import {BINANCE_WEBSOCKET} from "../constants";
import {updateOrderBookCache} from "@/lib/hooks/useOrderBookQuery";
import {UseOrderBookWebSocketOptions} from "@/types/orderbook";

export function useOrderBookWebSocket({
                                        symbol,
                                        depth,
                                        enabled = true
                                      }: UseOrderBookWebSocketOptions) {
  const queryClient = useQueryClient();
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const connectWebSocket = useCallback(() => {
    if (!enabled) return;
    
    if (ws.current) {
      ws.current.close();
    }
    
    setError(null);
    
    try {
      const stream = `${symbol.toLowerCase()}@depth${depth}`;
      const socketUrl = `${BINANCE_WEBSOCKET}/${stream}`;
      
      ws.current = new WebSocket(socketUrl);
      
      ws.current.onopen = () => {
        console.log('OrderBook WebSocket connected');
        setIsConnected(true);
      };
      
      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (!data) return;
          
          // 주문장 업데이트 데이터 추출
          const bids = data.b || data.bids;
          const asks = data.a || data.asks;
          const eventTime = data.E;
          const lastUpdateId = data.lastUpdateId || data.u;
          
          // bids와 asks가 모두 존재하고 배열인 경우에만 처리
          if (Array.isArray(bids) && Array.isArray(asks)) {
            updateOrderBookCache(
              queryClient,
              symbol,
              depth,
              bids,
              asks,
              eventTime,
              lastUpdateId
            );
          }
        } catch (err) {
          console.error('Error parsing WebSocket data:', err, event.data);
        }
      };
      
      ws.current.onerror = (error) => {
        console.error('OrderBook WebSocket error:', error);
        setError('주문장 데이터 연결 오류');
        setIsConnected(false);
      };
      
      ws.current.onclose = () => {
        console.log('OrderBook WebSocket closed');
        setIsConnected(false);
        
        // 3초 후 재연결 시도
        setTimeout(() => {
          if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
            connectWebSocket();
          }
        }, 3000);
      };
    } catch (err) {
      setError(`주문장 연결 오류: ${err}`);
      setIsConnected(false);
    }
  }, [symbol, depth, queryClient, enabled]);
  
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
  }, [connectWebSocket, enabled]);
  
  return {
    isConnected,
    error,
    reconnect: connectWebSocket
  };
}