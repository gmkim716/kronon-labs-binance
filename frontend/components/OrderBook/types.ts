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
