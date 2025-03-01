import React, {Suspense} from "react";
import {Search} from "@/components/search/Search";
import {OrderBook} from "@/components/orderBook/OrderBook";
import {Chart} from "@/components/chart/Chart";


// next.js 15 버전에 동적 라우팅 방식이 변경된 바가 있음
export default async function TradePage({params}: { params: Promise<{symbol: string}> }) {
  const { symbol } = await params;

  return (
    <div className="flex justify-between">
      <Suspense fallback={<div className="animate-pulse h-full w-full bg-gray-200">OrderBook 로딩 중...</div>}>
        <OrderBook symbol={symbol} />
      </Suspense>
      
      <Suspense fallback={<div className="animate-pulse h-full w-full bg-gray-200">Chart 로딩 중...</div>}>
        <Chart symbol={symbol} />
      </Suspense>
      
      <Search />
    </div>
  );
}