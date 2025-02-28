import {useOrderBook} from "@/lib/hooks/useOrderBook";
import {COLOR, ORDER_BOOK_DEPTH} from "../../lib/constants";
import {OrderBookRatioGraph} from "@/components/orderBook/OrderBookRatioGraph";

export const OrderBookCompare = ({symbol}:{symbol: string}) => {
  
  const {askRatio} = useOrderBook(symbol, {depth: ORDER_BOOK_DEPTH})
  
  const fBidRatio = (100-askRatio).toFixed(2)
  const fAskRatio = (100-askRatio).toFixed(2)
  
  return (
    <div className="flex items-center">
      <div>
        <span>B</span>
        <span style={{color: COLOR.BUY_COLOR}}>{fBidRatio}%</span>
      </div>
      <OrderBookRatioGraph askRatio={askRatio} />
      <div>
        <span style={{color: COLOR.SELL_COLOR}}>{fAskRatio}%</span>
        <span>S</span>
      </div>
    </div>
  )
}