import {CandleChart} from "@/components/charts/CandleChart";
import {binanceApi} from "@/apis/binanceApi";
import React from "react";
import {transformKlineToChartData} from "@/lib/utils";

export default async function TestPage() {
  
  
  const data = await binanceApi.getKlines('BTCUSDT', "1d", 60);
 
  if (!data) return;
  
  
  const chartData = data.map(kline => transformKlineToChartData(kline));
  
  
  return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">간단한 캔들스틱 차트</h1>
        
        <CandleChart data={chartData}/>
      </div>
  );
}


