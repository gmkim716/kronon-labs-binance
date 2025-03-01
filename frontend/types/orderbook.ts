export interface OrderItem {
  price: number;
  amount: number;
  total: number;
}

export interface OrderBookData {
  symbol: string;
  bids: OrderItem[];  // 매수 주문
  asks: OrderItem[];  // 매도 주문
  lastUpdateId?: number;
  timestamp?: number;
  askRatio: number;
}

export interface UseOrderBookOptions {
  depth?: number;  // 주문장 깊이: 5, 10, 20
}

export interface UseOrderBookWebSocketOptions {
  symbol: string;
  depth: number;
  enabled?: boolean;
}