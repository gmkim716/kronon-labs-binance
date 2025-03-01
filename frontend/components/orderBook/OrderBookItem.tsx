import {formatNumber} from "@/lib/utils";
import {OrderBookItemProps} from "@/types/orderbook";

export const OrderBookItem = ({price, amount, total, type}: OrderBookItemProps) => {
  
  // 단위 변환
  const fPrice = price.toFixed(2)
  const fAmount = amount.toFixed(5);
  const fTotal = formatNumber(total)
  
  // 색상을 위한 tailwindCSS 적용
  const colorClass = type === "bids" ?  'text-green-500': 'text-red-500';
  
  return (
    <div className="grid grid-cols-3 text-xs">
      <div className={`text-left ${colorClass}`}>
        {fPrice}
      </div>
      <div className="text-right">
        {fAmount}
      </div>
      <div className="text-right">
        {fTotal}
      </div>
    </div>
  )
}