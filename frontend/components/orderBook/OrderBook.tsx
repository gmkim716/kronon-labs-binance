import {OrderBookTableHeader} from "@/components/orderBook/OrderBookTableHeader";
import {OrderBookProps} from "@/components/orderBook/types";
import {SectionLayout} from "@/components/layout/SectionLayout";
import React from "react";
import {OrderBookContent} from "@/components/orderBook/OrderBookTableContent";

export const OrderBook = ({symbol}: OrderBookProps) => {

  return (
    <SectionLayout
      header={<div>OrderBook</div>}
      content={
        <div>
          <OrderBookTableHeader />
          <OrderBookContent symbol={symbol} />
        </div>
       }>
    </SectionLayout>
  )
}