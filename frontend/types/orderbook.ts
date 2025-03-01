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

export interface OrderBookItemProps {
  price: number,
  amount: number,
  total: number,
  type?: 'bids' | 'asks',
}

export interface OrderBookProps {
  symbol: string,
}

export interface  OrderBookCompareProps {
  bid: number,
  ask: number,
}

export interface TickerData {
  s: string; // 심볼
  c: string; // 현재 가격
  P: string; // 24시간 변동률(%)
}

export interface TickerStore {
  ticker: Record<string, TickerData>;
  setTicker: (updater: (prev: Record<string, TickerData>) => Record<string, TickerData>) => void;
}


export interface OrderBookRealTimeProps {
  priceDirection: 'up' | 'down' | null,
  price: number,
}
