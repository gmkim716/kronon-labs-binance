export interface OrderBookItemProps {
  price: number,
  amount: number,
  total: number,
  type?: 'buy' | 'sell',
}