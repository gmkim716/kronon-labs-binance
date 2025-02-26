import {OrderBookTableHeader} from "@/components/OrderBook/OrderBookTableHeader";
import {OrderBookProps} from "@/components/OrderBook/types";
import {SectionLayout} from "@/components/Layout/SectionLayout";
import React from "react";
import {OrderBookContent} from "@/components/OrderBook/OrderBookTableContent";

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