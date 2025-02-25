import {formatNumber} from "@/lib/utils/number-utils";
import {OrderBookItemProps} from "@/components/OrderBook/types";



/**
 * todo list
 * 1. total 단위가 클 때, K, M등 단위를 붙여야 함
 * 2. price: 소수점 2자리, amount: 소수점 5자리, total: 소수점 5자리
 * 3. price가 buy/sell 색상 다르게 표현
 */
export const OrderBookItem = ({price, amount, total, type}: OrderBookItemProps) => {
  
  const fPrice = price.toFixed(2)
  const fAmount = amount.toFixed(5);
  const fTotal = formatNumber(total)
  
  const colorClass = type === "buy" ? 'text-red-500' : 'text-green-500';
  
  return (
    <div className="grid grid-cols-3">
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