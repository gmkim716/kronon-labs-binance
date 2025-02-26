import {useOrderBook} from "@/lib/hooks/useOrderBook";
import {ORDERBOOK_DEPTH} from "@/lib/const/OrderBookConsts";
import {OrderBookRatioGraph} from "@/components/OrderBook/OrderBookRatioGraph";

export const OrderBookCompare = ({symbol}:{symbol: string}) => {
  
  const {askRatio} = useOrderBook(symbol, {depth: ORDERBOOK_DEPTH})
  
  const fBidRatio = (100-askRatio).toFixed(2)
  const fAskRatio = (100-askRatio).toFixed(2)
  
  return (
    <div className="flex items-center">
      <div>
        <span>B</span>
        <span className="text-green-500">{fBidRatio}%</span>
      </div>
      <OrderBookRatioGraph askRatio={askRatio} />
      <div>
        <span className="text-red-500">{fAskRatio}%</span>
        <span>S</span>
      </div>
    </div>
  )
}