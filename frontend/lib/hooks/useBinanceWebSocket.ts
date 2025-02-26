// hooks/useBinanceWebSocket.ts - 모든 바이낸스 웹소켓 연결에 사용할 수 있는 범용 훅
'use client';

import { useState, useEffect, useRef } from 'react';

type WebSocketCallback<T> = (data: T) => void;

interface UseBinanceWebSocketOptions {
  reconnectInterval?: number;
  reconnectAttempts?: number;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: any) => void;
}

export function useBinanceWebSocket<T = any>(
  streamName: string | string[],
  onData: WebSocketCallback<T>,
  options: UseBinanceWebSocketOptions = {}
) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  
  const {
    reconnectInterval = 3000,
    reconnectAttempts = Infinity,
    onOpen,
    onClose,
    onError
  } = options;
  
  useEffect(() => {
    let isActive = true;
    
    const connectWebSocket = () => {
      if (!isActive) return;
      
      // 기존 연결 정리
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      
      try {
        let socketUrl: string;
        
        // 단일 스트림 또는 다중 스트림 처리
        if (typeof streamName === 'string') {
          socketUrl = `wss://stream.binance.com:9443/ws/${streamName}`;
        } else if (Array.isArray(streamName) && streamName.length > 0) {
          socketUrl = `wss://stream.binance.com:9443/ws/${streamName.join('/')}`;
        } else {
          throw new Error('Invalid stream name');
        }
        
        wsRef.current = new WebSocket(socketUrl);
        
        wsRef.current.onopen = () => {
          if (!isActive) return;
          console.log('Binance WebSocket connected');
          setIsConnected(true);
          setError(null);
          reconnectCountRef.current = 0;
          onOpen?.();
        };
        
        wsRef.current.onmessage = (event) => {
          if (!isActive) return;
          try {
            const data = JSON.parse(event.data);
            onData(data);
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
          }
        };
        
        wsRef.current.onerror = (event) => {
          if (!isActive) return;
          console.error('WebSocket error:', event);
          setError('WebSocket connection error');
          onError?.(event);
        };
        
        wsRef.current.onclose = () => {
          if (!isActive) return;
          console.log('WebSocket connection closed');
          setIsConnected(false);
          onClose?.();
          
          // 재연결 로직
          if (reconnectCountRef.current < reconnectAttempts) {
            reconnectCountRef.current += 1;
            setTimeout(() => {
              if (isActive && (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED)) {
                connectWebSocket();
              }
            }, reconnectInterval);
          }
        };
        
      } catch (err) {
        if (!isActive) return;
        console.error('Error setting up WebSocket:', err);
        setError(err instanceof Error ? err.message : 'Unknown connection error');
        setIsConnected(false);
        onError?.(err);
      }
    };
    
    connectWebSocket();
    
    return () => {
      isActive = false;
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [typeof streamName === 'string' ? streamName : streamName.join(',')]);
  
  return { isConnected, error };
}