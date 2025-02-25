import { OrderBook } from '@/components/OrderBook/OrderBook';


const TEMP_LIST = [
  {
    price: 100,
    amount: 0.00012,
    total: 10000,
  },
  {
    price: 300,
    amount: 0.00345,
    total: 90000,
  },
  {
    price: 200,
    amount: 0.00012,
    total: 20000,
  },
]

const TEMP_REAL: { type: 'up' | 'down', price: number } = {
  type: 'up',
  price: 1000,
}

interface TradePageProps {
  params: {symbol: string}
}

export default function TradePage({params}: TradePageProps ) {
  console.log('symbol', params.symbol)
  return (
    <div>
      <OrderBook buyList={TEMP_LIST} sellList={TEMP_LIST} realtime={TEMP_REAL}/>
    </div>
  );
}