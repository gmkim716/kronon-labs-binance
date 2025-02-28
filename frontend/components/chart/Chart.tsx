import {CandleChart} from "@/components/chart/CandleChart";
import {SectionLayout} from "@/components/layout/SectionLayout";
import {SectionHeaderLayout} from "@/components/layout/SectionHeaderLayout";
import {SectionContentLayout} from "@/components/layout/SectionContentLayout";
import React from "react";
import {binanceApi} from "@/apis/binanceApi";
import {KLINE_INTERVALS} from "@/lib/constants";
import {Kline} from "@/types/binance";
import {transformKlineToChartData} from "@/lib/utils";

export const Chart = async ({symbol}: {symbol: string}) => {
  
  const historicalKlinesData = await binanceApi.getKlines(symbol, KLINE_INTERVALS.DAY, 90);
  const historicalChartData = historicalKlinesData.map((klinesData: Kline[]) => transformKlineToChartData(klinesData))
  
  return (
    <SectionLayout
      header = {
        <SectionHeaderLayout>
          Chart
        </SectionHeaderLayout>
      }
      content={
        <SectionContentLayout>
          <CandleChart historicalData={historicalChartData} symbol={symbol} interval="1d"/>
        </SectionContentLayout>
      }
    />
  )
}