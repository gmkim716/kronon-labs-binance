import React from "react";
import {Search} from "@/components/search/Search";
import {OrderBookContainer} from "@/components/orderBook/OrderBookContainer";
import {Chart} from "@/components/chart/Chart";

// next.js 15 버전에 동적 라우팅 방식이 변경된 바가 있음
export default async function TradePage({params}: { params: Promise<{symbol: string}> }) {
  const { symbol } = await params;

  return (
    <div className="flex justify-between">
      <OrderBookContainer symbol={symbol}/>
      
      <Chart symbol={symbol} />
      
      <Search />
    </div>
  );
}