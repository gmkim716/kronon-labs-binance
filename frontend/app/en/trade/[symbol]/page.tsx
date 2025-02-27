import React from "react";
import {Search} from "@/widgets/Search";
import {OrderBook} from "@/widgets/OrderBook";

// next.js 15 버전에 동적 라우팅 방식이 변경된 바가 있음
export default async function TradePage({params}: { params: Promise<{symbol: string}> }) {
  const resolvedParams = await params;
  const symbol = resolvedParams.symbol;
  
  return (
    <div className="flex justify-between">
      <OrderBook symbol={symbol}/>
      {/*<CoinFinancialChart symbol={symbol} width={300} height={200} />*/}
      <Search />
    </div>
  );
}