'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {BINANCE_WEBSOCKET} from "../constants";

// any 대신 명시적 타입 사용
type WebSocketData = Record<string, unknown>;
type WebSocketCallback<T> = (data: T) => void;
type WebSocketErrorEvent = Event | Error;

interface UseBinanceWebSocketOptions {
  reconnectInterval?: number;
  reconnectAttempts?: number;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: WebSocketErrorEvent) => void;
}


/**
 * Binance 거래소의 WebSocket API와 연결하고 데이터를 수신합니다
 * @param streamName
 * @param onData
 * @param options
 */
export function useBinanceWebSocket<T = WebSocketData>(
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
  
  // 의존성 배열에 포함시키기 위해 streamNameString 변수 생성
  const streamNameString = Array.isArray(streamName) ? streamName.join(',') : streamName;
  
  // onData 콜백을 useCallback으로 감싸면 좋지만,
  // 여기서는 외부에서 전달하는 값이므로 의존성 배열에만 추가
  
  const connectWebSocket = useCallback(() => {
    let isActive = true;
    
    // 기존 연결 정리
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    try {
      let socketUrl: string;
      
      // 단일 스트림 또는 다중 스트림 처리
      if (typeof streamName === 'string') {
        socketUrl = `${BINANCE_WEBSOCKET}/${streamName}`;
      } else if (Array.isArray(streamName) && streamName.length > 0) {
        socketUrl = `${BINANCE_WEBSOCKET}/${streamName.join('/')}`;
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
        if (onOpen) onOpen();
      };
      
      wsRef.current.onmessage = (event) => {
        if (!isActive) return;
        try {
          const data = JSON.parse(event.data) as T;
          onData(data);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };
      
      wsRef.current.onerror = (event) => {
        if (!isActive) return;
        console.error('WebSocket error:', event);
        setError('WebSocket connection error');
        if (onError) onError(event);
      };
      
      wsRef.current.onclose = () => {
        if (!isActive) return;
        console.log('WebSocket connection closed');
        setIsConnected(false);
        if (onClose) onClose();
        
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
      if (onError) onError(err instanceof Error ? err : new Error('Unknown error'));
    }
    
    return () => {
      isActive = false;
    };
  }, [streamName, onData, onOpen, onClose, onError, reconnectInterval, reconnectAttempts]);
  
  useEffect(() => {
    const cleanup = connectWebSocket();
    
    return () => {
      if (cleanup) {
        cleanup();
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [streamNameString, connectWebSocket]);
  
  return { isConnected, error };
}