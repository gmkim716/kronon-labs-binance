'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {BINANCE_WEBSOCKET, ORDER_BOOK_DEPTH} from "../constants";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {fetchOrderBookSnapshot} from "@/apis/orderbook";
import {OrderBookData, UseOrderBookOptions} from "@/types/orderbook";

export function useOrderBook(symbol: string, options: UseOrderBookOptions = {}) {
  const { depth = ORDER_BOOK_DEPTH } = options;
  const queryClient = useQueryClient();
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { data: orderBookData, isLoading, isError } = useQuery({
    queryKey: ['orderBook', symbol, depth],
    queryFn: () => fetchOrderBookSnapshot(symbol, depth),
    refetchOnWindowFocus: false,
    staleTime: Infinity, // WebSocket을 통해 업데이트되므로 자동 리프레시 비활성화
  });
  
  const connectWebSocket = useCallback(() => {
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
          
          // bids와 asks가 모두 존재하고 배열인 경우에만 처리
          if (Array.isArray(bids) && Array.isArray(asks)) {
            // 직접 쿼리 캐시 업데이트
            queryClient.setQueryData(['orderBook', symbol, depth], (oldData: OrderBookData | undefined) => {
              if (!oldData) return;
              
              const processedBids = bids.map((bid: string[]) => ({
                price: parseFloat(bid[0]),
                amount: parseFloat(bid[1]),
                total: parseFloat(bid[0]) * parseFloat(bid[1])
              }));
              
              const processedAsks = asks.map((ask: string[]) => ({
                price: parseFloat(ask[0]),
                amount: parseFloat(ask[1]),
                total: parseFloat(ask[0]) * parseFloat(ask[1])
              }));
              
              // 수량 합산
              const totalBidsAmount = processedBids.reduce((sum, bid) => sum + bid.amount, 0);
              const totalAsksAmount = processedAsks.reduce((sum, ask) => sum + ask.amount, 0);
              
              // 비율 계산 (매수 비율을 0-100% 사이로 표현)
              const bidRatio = totalBidsAmount / (totalBidsAmount + totalAsksAmount) * 100;
              
              return {
                ...oldData,
                bids: processedBids,
                asks: processedAsks,
                lastUpdateId: data.lastUpdateId || data.u || oldData.lastUpdateId,
                timestamp: eventTime || oldData.timestamp,
                askRatio: 100 - bidRatio,
                bidRatio: bidRatio,
              };
            });
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
  }, [symbol, depth, queryClient]);
  
  useEffect(() => {
    if (orderBookData) {
      connectWebSocket();
    }
    
    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [orderBookData, connectWebSocket]);
  
  return {
    bids: orderBookData?.bids || [],
    asks: orderBookData?.asks || [],
    isConnected,
    isLoading,
    error: isError ? '데이터 로드 중 오류 발생' : error,
    askRatio: orderBookData?.askRatio || 0,
    bidRatio: orderBookData?.bidRatio,
  };
}