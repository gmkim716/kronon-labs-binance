import {OrderBook} from '@/widgets/OrderBook';
import {Search} from "@/widgets/Search";
import BinanceWebSocket from "@/components/Test/BinanceWebSocket";


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

export default async function TradePage({params}: TradePageProps ) {
  
  const symbol = params.symbol;
  console.log('symbol', symbol)
  
  const symbols = [symbol]
  
  return (
    <div>
      <BinanceWebSocket symbols={symbols} />
      
      <OrderBook buyList={TEMP_LIST} sellList={TEMP_LIST} realtime={TEMP_REAL}/>
    
      <Search />
    </div>
  );
}