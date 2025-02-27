export const OrderBookTableHeader = () => {
  return (
    <div className="grid grid-cols-3">
      <div className="text-left text-gray-400">
        Price (USDT)
      </div>
      <div className="text-right text-gray-400">
        Amount (BTC)
      </div>
      <div className="text-right text-gray-400">
        Total
      </div>
    </div>
  )
}