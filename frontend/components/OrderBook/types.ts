export interface OrderBookItemProps {
  price: number,
  amount: number,
  total: number,
  type?: 'buy' | 'sell',
}

export interface OrderBookProps {
  realtime: {
    type: 'up' | 'down',
    price: number,
  },
  buyList: OrderBookItemProps[],
  sellList: OrderBookItemProps[],
}

export interface  OrderBookCompareProps {
  buy: number,
  sell: number,
}
