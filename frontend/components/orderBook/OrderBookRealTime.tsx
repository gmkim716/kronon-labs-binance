'use client'

interface OrderBookRealTimeProps {
  priceDirection: 'up' | 'down' | null,
  price: number,
}

export const OrderBookRealTime = ({priceDirection, price}: OrderBookRealTimeProps) => {
  
  // 색상 표시
  let colorClass = 'text-white';
  if (priceDirection === 'up') {
    colorClass = 'text-green-500';
  } else if (priceDirection === 'down') {
    colorClass = 'text-red-500';
  }
  
  const marker = priceDirection === 'up' ?  '⬆' : '⬇';
  
  return (
    <div className={`flex items-center ${colorClass} gap-2`}>
      <div className="text-xl">{price} {marker}</div>
      <div className="text-gray-500 text-xs">${price}</div>
    </div>
  )
}