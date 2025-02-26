'use client'

import {useOrderBook} from "@/lib/hooks/useOrderBook";
import React from "react";
import {OrderBookItem} from "@/components/OrderBook/OrderBookItem";
import {OrderBookCompare} from "@/components/OrderBook/OrderBookCompare";
import {useTicker} from "@/lib/hooks/useTicker";
import {OrderBookRealTime} from "@/components/OrderBook/OrderBookRealTime";
import {ORDERBOOK_DEPTH} from "@/lib/const/OrderBookConsts";

export const OrderBookContent = ({symbol}: {symbol: string}) => {
  
  const { bids, asks} = useOrderBook(symbol, {depth: ORDERBOOK_DEPTH})
  const {ticker, priceDirection} = useTicker(symbol)
  
  return (
    <div>
      {/* ask: 매도*/}
      {asks.map((ask, idx) => (
        <OrderBookItem key={idx} price={ask.price} amount={ask.amount} total={ask.total} type="asks" />
      ))}

      {/* 현재가 */}
      <OrderBookRealTime priceDirection={priceDirection} price={ticker.lastPrice} />
    
      {/* bids: 매수 */}
      {bids.map((bid, idx) => (
        <OrderBookItem key={idx} price={bid.price} amount={bid.amount} total={bid.total} type="bids" />
      ))}
      
      {/* 매수/매도 비율 */}
      <OrderBookCompare symbol={symbol} />
    </div>
  )
}