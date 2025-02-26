'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {ORDERBOOK_DEPTH} from "@/lib/const/OrderBookConsts";

// 주문장 항목 타입 정의
export interface OrderItem {
  price: number;
  amount: number;
  total: number;
}

// 주문장 데이터 타입 정의
export interface OrderBookData {
  symbol: string;
  bids: OrderItem[];  // 매수 주문
  asks: OrderItem[];  // 매도 주문
  lastUpdateId?: number;
  timestamp?: number;
  askRatio: number;
}

interface UseOrderBookOptions {
  depth?: number;  // 주문장 깊이: 5, 10, 20
}

/**
 * 바이낸스 실시간 주문장 데이터를 가져오는 훅
 * @param symbol 심볼 코드 (예: 'btcusdt', 'ethusdt')
 * @param options 추가 옵션 (depth: 주문장 깊이)
 * @returns 주문장 데이터와 연결 상태
 */
export function useOrderBook(symbol: string, options: UseOrderBookOptions = {}) {
  const [orderBookData, setOrderBookData] = useState<OrderBookData>({
    symbol: symbol.toUpperCase(),
    bids: [],
    asks: [],
    askRatio: 0,
  });
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  
  const { depth = ORDERBOOK_DEPTH } = options;
  
  // WebSocket 연결 함수
  const connectWebSocket = useCallback(() => {
    // 이전 연결이 있으면 닫기
    if (ws.current) {
      ws.current.close();
    }
    
    setError(null);
    
    try {
      // 주문장 스트림 구독 - 여기서 형식을 변경합니다
      // @bookTicker는 최고 매수/매도 호가만 제공, @depth는 전체 주문장 제공
      const stream = `${symbol.toLowerCase()}@depth${depth}`;
      const socketUrl = `wss://stream.binance.com:9443/ws/${stream}`;
      
      // WebSocket 연결 생성
      ws.current = new WebSocket(socketUrl);
      
      // 연결 성공 시
      ws.current.onopen = () => {
        console.log('OrderBook WebSocket connected');
        setIsConnected(true);
        
        // 연결 후 주문장 스냅샷 요청
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          // REST API로 주문장 스냅샷 가져오기
          fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol.toUpperCase()}&limit=${depth}`)
            .then(response => response.json())
            .then(data => {
              // 주문장 초기 데이터 설정
              if (data && data.bids && data.asks) {
                setOrderBookData({
                  symbol: symbol.toUpperCase(),
                  bids: data.bids.map((bid: string[]) => ({
                    price: parseFloat(bid[0]),
                    amount: parseFloat(bid[1]),
                    total: parseFloat(bid[0]) * parseFloat(bid[1])
                  })),
                  asks: data.asks.map((ask: string[]) => ({
                    price: parseFloat(ask[0]),
                    amount: parseFloat(ask[1]),
                    total: parseFloat(ask[0]) * parseFloat(ask[1])
                  })),
                  lastUpdateId: data.lastUpdateId,
                  askRatio: 0,
                });
              }
            })
            .catch(err => {
              console.error('Error fetching orderbook snapshot:', err);
              setError('주문장 초기 데이터 로드 오류');
            });
        }
      };
      
      // 메시지 수신 시
      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // 데이터 형식 확인 및 안전하게 처리
          // console.log('WebSocket 데이터:', data); // 디버깅용
          
          if (!data) return;
          
          // 주문장 업데이트 데이터 추출
          const bids = data.b || data.bids;
          const asks = data.a || data.asks;
          const eventTime = data.E;
          
          // bids와 asks가 모두 존재하고 배열인 경우에만 처리
          if (Array.isArray(bids) && Array.isArray(asks)) {
            // 매수/매도 주문량 계산 로직
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
            
            setOrderBookData(prevData => ({
              symbol: symbol.toUpperCase(),
              // 이전 데이터를 유지하면서 새 데이터로 업데이트
              bids: bids.map((bid: string[]) => ({
                price: parseFloat(bid[0]),
                amount: parseFloat(bid[1]),
                total: parseFloat(bid[0]) * parseFloat(bid[1])
              })),
              asks: asks.map((ask: string[]) => ({
                price: parseFloat(ask[0]),
                amount: parseFloat(ask[1]),
                total: parseFloat(ask[0]) * parseFloat(ask[1])
              })),
              lastUpdateId: data.lastUpdateId || data.u || prevData.lastUpdateId,
              timestamp: eventTime || prevData.timestamp,
              askRatio: 100-bidRatio,
              bidRatio: bidRatio,
            }));
          }
        } catch (err) {
          console.error('Error parsing WebSocket data:', err, event.data);
        }
      };
      
      // 에러 발생 시
      ws.current.onerror = (error) => {
        console.error('OrderBook WebSocket error:', error);
        setError('주문장 데이터 연결 오류');
        setIsConnected(false);
      };
      
      // 연결 종료 시
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
  }, [symbol, depth]);
  
  // 컴포넌트 마운트 시 WebSocket 연결
  useEffect(() => {
    connectWebSocket();
    
    // 컴포넌트 언마운트 시 WebSocket 연결 종료
    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [symbol, depth, connectWebSocket]);
  
  return {
    bids: orderBookData.bids,
    asks: orderBookData.asks,
    isConnected,
    error,
    askRatio: orderBookData.askRatio,
  };
}