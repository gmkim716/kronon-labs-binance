'use client';

import {useCallback, useState} from 'react';
import {TickerData} from "@/types/ticker";
import {useTickerWebSocket} from "@/lib/hooks/useTickerWebSocket";

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
  
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | null>(null);
  
  const handleTickerUpdate = useCallback((data: TickerData, direction: 'up' | 'down' | null) => {
    setTickerData(data);
    if (direction) {
      setPriceDirection(direction);
    }
  }, []);
  
  const { isConnected, error, reconnect } = useTickerWebSocket({
    symbol,
    onTickerUpdate: handleTickerUpdate
  });
  
  return {
    ticker: tickerData,
    priceDirection,
    isConnected,
    error
  };
}