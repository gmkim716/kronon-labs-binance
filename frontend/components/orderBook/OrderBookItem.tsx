import {formatNumber} from "@/lib/utils";
import {OrderBookItemProps} from "@/components/orderBook/types";

/**
 * todo list
 * 1. total 단위가 클 때, K, M등 단위를 붙여야 함
 * 2. price: 소수점 2자리, amount: 소수점 5자리, total: 소수점 5자리
 * 3. price가 bids/asks 색상 다르게 표현, bid: 매수, 초록색, ask: 매도, 빨간색
 */
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