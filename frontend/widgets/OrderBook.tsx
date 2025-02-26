import {OrderBookItem} from "@/components/OrderBook/OrderBookItem";
import {OrderBookTableHeader} from "@/components/OrderBook/OrderBookTableHeader";
import {OrderBookRealTime} from "@/components/OrderBook/OrderBookRealTime";
import {OrderBookProps} from "@/components/OrderBook/types";
import {OrderBookCompare} from "@/components/OrderBook/OrderBookCompare";
import {SectionLayout} from "@/components/Layout/SectionLayout";

export const OrderBook = ({realtime, buyList, sellList}: OrderBookProps) => {
  return (
    <SectionLayout
      header={
        <div>
          OrderBook
        </div>
      }
      content={
        <div>
          <OrderBookTableHeader />
          {buyList.map((item) => (
            <OrderBookItem price={item.price} amount={item.amount} total={item.total} type='buy'/>
          ))}
          <OrderBookRealTime type={realtime.type} price={realtime.price} />
          {sellList.map((item) => (
            <OrderBookItem price={item.price} amount={item.amount} total={item.total} type='sell'/>
          ))}
          <OrderBookCompare buy={100} sell={120} />
        </div>
       }>
    </SectionLayout>
  )
}