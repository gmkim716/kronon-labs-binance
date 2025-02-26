import {useOrderBook} from "@/lib/hooks/useOrderBook";
import {ORDER_BOOK_DEPTH} from "@/lib/consts";
import {OrderBookRatioGraph} from "@/components/OrderBook/OrderBookRatioGraph";

export const OrderBookCompare = ({symbol}:{symbol: string}) => {
  
  const {askRatio} = useOrderBook(symbol, {depth: ORDER_BOOK_DEPTH})
  
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