import {OrderBook} from '@/widgets/OrderBook';
import {Search} from "@/widgets/Search";
import BinanceWebSocket from "@/components/Test/BinanceWebSocket";
import React from "react";


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


// next.js 15 버전에 동적 라우팅 방식이 변경된 바가 있음
export default async function TradePage({params}: { params: Promise<{symbol: string}> }) {
  const resolvedParams = await params;
  const symbol = resolvedParams.symbol;
  return (
    <>
      <BinanceWebSocket symbols={[symbol]} />
      
      <OrderBook buyList={TEMP_LIST} sellList={TEMP_LIST} realtime={TEMP_REAL}/>
    
      <Search />
    </>
  );
}