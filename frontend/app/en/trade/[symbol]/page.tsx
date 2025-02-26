import {OrderBook} from '@/widgets/OrderBook';
import React from "react";

// next.js 15 버전에 동적 라우팅 방식이 변경된 바가 있음
export default async function TradePage({params}: { params: Promise<{symbol: string}> }) {
  const resolvedParams = await params;
  const symbol = resolvedParams.symbol;
  
  return (
    <>
      <OrderBook symbol={symbol}/>
    
      {/*<Search />*/}
    </>
  );
}