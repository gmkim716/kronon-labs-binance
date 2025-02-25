interface  OrderBookCompareProps {
  buy: number,
  sell: number,
}

export const OrderBookCompare = ({buy, sell}:OrderBookCompareProps) => {
  
  const total = buy + sell;
  
  if (total == 0) return
  
  const buyRatio= buy / total;
  const fBuyRatio = (buy/total).toFixed(2)
  const fSellRatio  = (sell/total).toFixed(2)
  
  return (
    <div className="flex">
      <div>B</div>
      <span className="text-green-500">{fBuyRatio}%</span>
      buyRatio: {buyRatio}
      <span className="text-red-500">{fSellRatio}%</span>
      <div>S</div>
    </div>
  )
}