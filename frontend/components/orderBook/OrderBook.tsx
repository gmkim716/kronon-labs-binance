import {OrderBookTableHeader} from "@/components/orderBook/OrderBookTableHeader";
import {OrderBookProps} from "@/components/orderBook/types";
import {SectionLayout} from "@/components/layout/SectionLayout";
import React from "react";
import {OrderBookContent} from "@/components/orderBook/OrderBookTableContent";
import {SectionTitle} from "@/components/layout/SectionTitle";
import {SectionHeaderLayout} from "@/components/layout/SectionHeaderLayout";
import {SectionContentLayout} from "@/components/layout/SectionContentLayout";

export const OrderBook = ({symbol}: OrderBookProps) => {

  return (
    <SectionLayout
      header={
        <SectionHeaderLayout>
          <SectionTitle title="OrderBook" />
        </SectionHeaderLayout>
      }
      content={
        <SectionContentLayout>
          <OrderBookTableHeader />
          <OrderBookContent symbol={symbol} />
        </SectionContentLayout>
       }>
    </SectionLayout>
  )
}