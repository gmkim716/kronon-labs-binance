'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTickerStore } from "@/store/useTickerStore";

interface BinanceWebSocketProps {
  symbols: string[]; // 사용할 심볼 리스트 (예: ['btcusdt', 'ethusdt'])
  interval?: string; // 캔들스틱 간격 (예: '1m', '5m', '1h')
}

// interface TickerData {
//   s: string; // 심볼
//   c: string; // 현재 가격
//   P: string; // 24시간 변동률(%)
// }

export const BinanceWebSocket = ({ symbols }: BinanceWebSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  
  const { ticker, setTicker } = useTickerStore();
  
  // symbols 배열을 문자열로 변환하여 의존성 배열에 사용
  const symbolsString = symbols.join(',');
  
  // WebSocket 연결 함수
  const connectWebSocket = useCallback(() => {
    // 이전 연결이 있으면 닫기
    if (ws.current) {
      ws.current.close();
    }
    
    setError(null);
    
    try {
      // 모든 심볼에 대한 구독 스트림 생성
      const streams = symbols.map(symbol => `${symbol.toLowerCase()}@ticker`).join('/');
      const socketUrl = `wss://stream.binance.com:9443/ws/${streams}`;
      
      // WebSocket 연결 생성
      ws.current = new WebSocket(socketUrl);
      
      // 연결 성공 시
      ws.current.onopen = () => {
        console.log('Binance WebSocket connected');
        setIsConnected(true);
      };
      
      // 메시지 수신 시
      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setTicker(prev => ({
          ...prev,
          [data.s]: data
        }));
      };
      
      // 에러 발생 시
      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket 연결 중 오류가 발생했습니다.');
        setIsConnected(false);
      };
      
      // 연결 종료 시
      ws.current.onclose = () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
        
        // 3초 후 재연결 시도
        setTimeout(() => {
          if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
            connectWebSocket();
          }
        }, 3000);
      };
    } catch (err) {
      setError(`WebSocket 연결 중 예외가 발생했습니다: ${err}`);
      setIsConnected(false);
    }
  }, [symbols, setTicker]);
  
  // 컴포넌트 마운트 시 WebSocket 연결
  useEffect(() => {
    connectWebSocket();
    
    // 컴포넌트 언마운트 시 WebSocket 연결 종료
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [symbolsString, connectWebSocket]); // symbols 배열이 변경되면 WebSocket 재연결
  
  // 연결 상태에 따른 UI 렌더링
  return (
    <div className="binance-websocket">
      <div className="connection-status">
        연결 상태: {isConnected ? '연결됨' : '연결 중...'}
        {error && <div className="error-message">{error}</div>}
      </div>
      
      <div className="ticker-data">
        <h2>실시간 가격 정보</h2>
        <ul>
          {Object.entries(ticker).map(([symbol, data]) => (
            <li key={symbol}>
              <strong>{symbol}:</strong> 현재 가격: {data.c},
              24시간 변동률: {parseFloat(data.P).toFixed(2)}%
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BinanceWebSocket;