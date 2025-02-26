'use client'

import {useTickerStore} from "@/store/useTickerStore";

interface OrderBookRealTimeProps {
  type: 'up' | 'down',
  price: number,
}

export const OrderBookRealTime = ({type, price}: OrderBookRealTimeProps) => {
  
  const colorClass = type === 'up' ? 'text-red-500' : 'text-green-500';
  const marker = type === 'up' ?  '⬆' : '⬇';
  
  const {ticker} = useTickerStore();
  
  console.log('ticker', ticker['BTCUSDT'])
  
  return (
    <div className={`flex items-center ${colorClass}`}>
      <div className="text-3xl font-bold">{price} {marker}</div>
      <div className="text-gray-500">${price}</div>
    </div>
  )
}