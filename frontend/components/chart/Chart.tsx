import {CandleChart} from "@/components/chart/CandleChart";
import {SectionLayout} from "@/components/layout/SectionLayout";
import {SectionHeaderLayout} from "@/components/layout/SectionHeaderLayout";
import {SectionContentLayout} from "@/components/layout/SectionContentLayout";
import React from "react";
import {SectionTitle} from "@/components/layout/SectionTitle";
import {KLINE_INTERVALS} from "@/lib/constants";

export const Chart = async ({symbol}: {symbol: string}) => {
  
  return (
    <SectionLayout
      header = {
        <SectionHeaderLayout>
          <SectionTitle title="Chart" />
        </SectionHeaderLayout>
      }
      content={
        <SectionContentLayout>
          <CandleChart symbol={symbol} interval={KLINE_INTERVALS.DAY}/>
        </SectionContentLayout>
      }
    />
  )
}