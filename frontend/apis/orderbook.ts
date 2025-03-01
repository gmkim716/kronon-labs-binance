
// 초기 주문장 스냅샷을 가져오는 함수
import {BINANCE_URL} from "@/lib/constants";
import {OrderItem} from "@/types/orderbook";

export const fetchOrderBookSnapshot = async (symbol: string, depth: number): Promise<{
  symbol: string;
  lastUpdateId: any;
  askRatio: number;
  asks: any;
  bids: any;
  bidRatio: number
}> => {
  const response = await fetch(`${BINANCE_URL}/depth?symbol=${symbol.toUpperCase()}&limit=${depth}`);
  const data = await response.json();
  
  if (!data || !data.bids || !data.asks) {
    throw new Error('Invalid order book data');
  }
  
  const processedBids = data.bids.map((bid: string[]) => ({
    price: parseFloat(bid[0]),
    amount: parseFloat(bid[1]),
    total: parseFloat(bid[0]) * parseFloat(bid[1])
  }));
  
  const processedAsks = data.asks.map((ask: string[]) => ({
    price: parseFloat(ask[0]),
    amount: parseFloat(ask[1]),
    total: parseFloat(ask[0]) * parseFloat(ask[1])
  }));
  
  // 수량 합산
  const totalBidsAmount = processedBids.reduce((sum: number, bid:OrderItem) => sum + bid.amount, 0);
  const totalAsksAmount = processedAsks.reduce((sum: number, ask:OrderItem) => sum + ask.amount, 0);
  
  // 비율 계산 (매수 비율을 0-100% 사이로 표현)
  const bidRatio = totalBidsAmount / (totalBidsAmount + totalAsksAmount) * 100;
  
  return {
    symbol: symbol.toUpperCase(),
    bids: processedBids,
    asks: processedAsks,
    lastUpdateId: data.lastUpdateId,
    askRatio: 100 - bidRatio,
    bidRatio: bidRatio,
  };
};


