'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// 티커 데이터 타입 정의
export interface TickerData {
  symbol: string;
  lastPrice: number;
  priceChange: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  quoteVolume: number;
}

/**
 * 바이낸스 실시간 티커 데이터를 가져오는 훅
 * @param symbol 심볼 코드 (예: 'btcusdt', 'ethusdt')
 * @returns 티커 데이터와 연결 상태
 */
export function useTicker(symbol: string) {
  const [tickerData, setTickerData] = useState<TickerData>({
    symbol: symbol.toUpperCase(),
    lastPrice: 0,
    priceChange: 0,
    priceChangePercent: 0,
    highPrice: 0,
    lowPrice: 0,
    volume: 0,
    quoteVolume: 0
  });
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  
  // 이전 가격과 현재 가격을 비교하기 위한 ref
  const prevPriceRef = useRef<number>(0);
  // 가격 변동 방향 (up 또는 down)
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | null>(null);
  
  // WebSocket 연결 함수
  const connectWebSocket = useCallback(() => {
    // 이전 연결이 있으면 닫기
    if (ws.current) {
      ws.current.close();
    }
    
    setError(null);
    
    try {
      // 티커 스트림 구독
      const stream = `${symbol.toLowerCase()}@ticker`;
      const socketUrl = `wss://stream.binance.com:9443/ws/${stream}`;
      
      // WebSocket 연결 생성
      ws.current = new WebSocket(socketUrl);
      
      // 연결 성공 시
      ws.current.onopen = () => {
        console.log('Ticker WebSocket connected');
        setIsConnected(true);
        
        // 연결 후 초기 티커 데이터 가져오기
        fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol.toUpperCase()}`)
          .then(response => response.json())
          .then(data => {
            if (data) {
              const lastPrice = parseFloat(data.lastPrice);
              prevPriceRef.current = lastPrice;
              
              setTickerData({
                symbol: data.symbol,
                lastPrice: lastPrice,
                priceChange: parseFloat(data.priceChange),
                priceChangePercent: parseFloat(data.priceChangePercent),
                highPrice: parseFloat(data.highPrice),
                lowPrice: parseFloat(data.lowPrice),
                volume: parseFloat(data.volume),
                quoteVolume: parseFloat(data.quoteVolume)
              });
            }
          })
          .catch(err => {
            console.error('Error fetching ticker data:', err);
          });
      };
      
      // 메시지 수신 시
      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (!data) return;
          
          // 티커 데이터 추출
          const lastPrice = parseFloat(data.c);
          
          // 이전 가격과 비교하여 방향 결정
          if (prevPriceRef.current !== 0) {
            if (lastPrice > prevPriceRef.current) {
              setPriceDirection('up');
            } else if (lastPrice < prevPriceRef.current) {
              setPriceDirection('down');
            }
          }
          
          // 현재 가격을 이전 가격으로 저장
          prevPriceRef.current = lastPrice;
          
          // 티커 데이터 업데이트
          setTickerData({
            symbol: data.s,
            lastPrice: lastPrice,
            priceChange: parseFloat(data.p),
            priceChangePercent: parseFloat(data.P),
            highPrice: parseFloat(data.h),
            lowPrice: parseFloat(data.l),
            volume: parseFloat(data.v),
            quoteVolume: parseFloat(data.q)
          });
        } catch (err) {
          console.error('Error parsing WebSocket data:', err);
        }
      };
      
      // 에러 발생 시
      ws.current.onerror = (error) => {
        console.error('Ticker WebSocket error:', error);
        setError('티커 데이터 연결 오류');
        setIsConnected(false);
      };
      
      // 연결 종료 시
      ws.current.onclose = () => {
        console.log('Ticker WebSocket closed');
        setIsConnected(false);
        
        // 3초 후 재연결 시도
        setTimeout(() => {
          if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
            connectWebSocket();
          }
        }, 3000);
      };
    } catch (err) {
      setError(`티커 연결 오류: ${err}`);
      setIsConnected(false);
    }
  }, [symbol]);
  
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
  }, [symbol, connectWebSocket]);
  
  return {
    ticker: tickerData,
    priceDirection,
    isConnected,
    error
  };
}