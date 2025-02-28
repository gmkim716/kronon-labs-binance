import {CandleChart} from "@/components/chart/CandleChart";
import {SectionLayout} from "@/components/layout/SectionLayout";
import {SectionHeaderLayout} from "@/components/layout/SectionHeaderLayout";
import {SectionContentLayout} from "@/components/layout/SectionContentLayout";
import React from "react";
import {SectionTitle} from "@/components/layout/SectionTitle";

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
          <CandleChart symbol={symbol} interval="1m"/>
        </SectionContentLayout>
      }
    />
  )
}