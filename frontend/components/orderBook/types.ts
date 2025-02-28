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
