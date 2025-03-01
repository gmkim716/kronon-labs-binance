'use client';

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOrderBookSnapshot } from "@/apis/orderbook";
import { OrderBookData } from "@/types/orderbook";
import { ORDER_BOOK_DEPTH } from "../constants";


export const getOrderBookQueryKey = (symbol: string, depth: number) =>
  ['orderBook', symbol, depth] as const;


export function useOrderBookQuery(symbol: string, depth: number = ORDER_BOOK_DEPTH) {
  return useQuery({
    queryKey: getOrderBookQueryKey(symbol, depth),
    queryFn: () => fetchOrderBookSnapshot(symbol, depth),
    refetchOnWindowFocus: false,
    staleTime: Infinity, // WebSocket을 통해 업데이트되므로 자동 리프레시 비활성화
  });
}


export function updateOrderBookCache(
  queryClient: ReturnType<typeof useQueryClient>,
  symbol: string,
  depth: number,
  bids: string[][],
  asks: string[][],
  eventTime?: number,
  lastUpdateId?: number
) {
  queryClient.setQueryData(
    getOrderBookQueryKey(symbol, depth),
    (oldData: OrderBookData | undefined) => {
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
      
      const totalBidsAmount = processedBids.reduce((sum: number, bid) => sum + bid.amount, 0);
      const totalAsksAmount = processedAsks.reduce((sum: number, ask) => sum + ask.amount, 0);
      
      const bidRatio = totalBidsAmount / (totalBidsAmount + totalAsksAmount) * 100;
      
      return {
        ...oldData,
        bids: processedBids,
        asks: processedAsks,
        lastUpdateId: lastUpdateId || oldData.lastUpdateId,
        timestamp: eventTime || oldData.timestamp,
        askRatio: 100 - bidRatio,
        bidRatio: bidRatio,
      };
    }
  );
}