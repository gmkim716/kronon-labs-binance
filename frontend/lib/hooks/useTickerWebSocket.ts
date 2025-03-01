'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {TickerData, UseTickerWebSocketOptions, UseTickerWebSocketResult} from "@/types/ticker";
import {BINANCE_URL, BINANCE_WEBSOCKET} from "@/lib/constants";

export function useTickerWebSocket({
                                     symbol,
                                     enabled = true,
                                     onTickerUpdate
                                   }: UseTickerWebSocketOptions): UseTickerWebSocketResult {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const prevPriceRef = useRef<number>(0);
  
  const connectWebSocket = useCallback(() => {
    if (!enabled) return;
    
    if (ws.current) {
      ws.current.close();
    }
    
    setError(null);
    
    try {
      const stream = `${symbol.toLowerCase()}@ticker`;
      const socketUrl = `${BINANCE_WEBSOCKET}/${stream}`;
      
      ws.current = new WebSocket(socketUrl);
      
      ws.current.onopen = () => {
        console.log('Ticker WebSocket connected');
        setIsConnected(true);
        
        fetch(`${BINANCE_URL}/ticker/24hr?symbol=${symbol.toUpperCase()}`)
          .then(response => response.json())
          .then(data => {
            if (data && onTickerUpdate) {
              const lastPrice = parseFloat(data.lastPrice);
              prevPriceRef.current = lastPrice;
              
              const tickerData: TickerData = {
                symbol: data.symbol,
                lastPrice: lastPrice,
                priceChange: parseFloat(data.priceChange),
                priceChangePercent: parseFloat(data.priceChangePercent),
                highPrice: parseFloat(data.highPrice),
                lowPrice: parseFloat(data.lowPrice),
                volume: parseFloat(data.volume),
                quoteVolume: parseFloat(data.quoteVolume)
              };
              
              onTickerUpdate(tickerData, null);
            }
          })
          .catch(err => {
            console.error('Error fetching ticker data:', err);
          });
      };
      
      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (!data || !onTickerUpdate) return;
          
          const lastPrice = parseFloat(data.c);
          
          let priceDirection: 'up' | 'down' | null = null;
          if (prevPriceRef.current !== 0) {
            if (lastPrice > prevPriceRef.current) {
              priceDirection = 'up';
            } else if (lastPrice < prevPriceRef.current) {
              priceDirection = 'down';
            }
          }
          
          prevPriceRef.current = lastPrice;
          
          const tickerData: TickerData = {
            symbol: data.s,
            lastPrice: lastPrice,
            priceChange: parseFloat(data.p),
            priceChangePercent: parseFloat(data.P),
            highPrice: parseFloat(data.h),
            lowPrice: parseFloat(data.l),
            volume: parseFloat(data.v),
            quoteVolume: parseFloat(data.q)
          };
          
          onTickerUpdate(tickerData, priceDirection);
        } catch (err) {
          console.error('Error parsing WebSocket data:', err);
        }
      };
      
      ws.current.onerror = (error) => {
        console.error('Ticker WebSocket error:', error);
        setError('티커 데이터 연결 오류');
        setIsConnected(false);
      };
      
      ws.current.onclose = () => {
        console.log('Ticker WebSocket closed');
        setIsConnected(false);
        
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
  }, [symbol, enabled, onTickerUpdate]);
  
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
  }, [symbol, enabled, connectWebSocket]);
  
  return {
    isConnected,
    error,
    reconnect: connectWebSocket
  };
}