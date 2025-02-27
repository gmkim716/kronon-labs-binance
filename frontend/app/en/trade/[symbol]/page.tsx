import React from "react";
import {binanceApi} from "@/apis/binanceApi";
import {KLINE_INTERVALS} from "@/lib/constants";
import {CandleChart} from "@/components/charts/CandleChart";


// next.js 15 버전에 동적 라우팅 방식이 변경된 바가 있음
export default async function TradePage({params}: { params: Promise<{symbol: string}> }) {
  const { symbol } = await params;
  
  const klineResponse = await binanceApi.getKlines(symbol, KLINE_INTERVALS.DAY, 3);
  
  
  return (
    <div className="flex justify-between">
      {/*<OrderBook symbol={symbol}/>*/}
      
      <div>
        <h1 className="text-2xl font-bold mb-4">간단한 캔들스틱 차트</h1>
        <div className="bg-pink-500 w-[300px] h-[200px]"/>
      </div>
      {/*<CandleChart data={klineResponse}/>*/}
      
      {/*<Search />*/}
    </div>
  );
}