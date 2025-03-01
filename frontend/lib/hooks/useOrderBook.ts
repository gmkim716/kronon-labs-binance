'use client';

import {ORDER_BOOK_DEPTH} from "../constants";
import {UseOrderBookOptions} from "@/types/orderbook";
import {useOrderBookQuery} from "@/lib/hooks/useOrderBookQuery";
import {useOrderBookWebSocket} from "@/lib/hooks/useOrderBookWebSocket";
import {error} from "next/dist/build/output/log";

export function useOrderBook(symbol: string, options: UseOrderBookOptions = {}) {
  const { depth = ORDER_BOOK_DEPTH } = options;
  
  // 초기 데이터 연결
  const {
    data: orderBookData,
    isLoading,
    isError,
  } = useOrderBookQuery(symbol, depth);
  
  // 웹 소켓 연결
  const {
    isConnected,
    error: wsError,
  } = useOrderBookWebSocket({
    symbol,
    depth,
    enabled: !!orderBookData, // 초기 데이터가 로드된 후에만 WebSocket 연결
  });
  
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