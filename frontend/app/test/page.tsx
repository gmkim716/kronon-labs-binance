// app/crypto/page.tsx
'use client';

import { useState } from 'react';
import BinanceWebSocket from "@/components/Test/BinanceWebSocket";

export default function CryptoPage() {
  const [symbols, setSymbols] = useState(['btcusdt', 'ethusdt', 'solusdt']);
  const [newSymbol, setNewSymbol] = useState('');
  
  const handleAddSymbol = () => {
    if (newSymbol && !symbols.includes(newSymbol.toLowerCase())) {
      setSymbols([...symbols, newSymbol.toLowerCase()]);
      setNewSymbol('');
    }
  };
  
  const handleRemoveSymbol = (symbolToRemove: string) => {
    setSymbols(symbols.filter(symbol => symbol !== symbolToRemove));
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">바이낸스 실시간 시세</h1>
      
      <div className="mb-6">
        <div className="flex mb-2">
          <input
            type="text"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            placeholder="심볼 추가 (예: bnbusdt)"
            className="border p-2 rounded mr-2"
          />
          <button
            onClick={handleAddSymbol}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            추가
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {symbols.map(symbol => (
            <div key={symbol} className="bg-gray-100 px-3 py-1 rounded flex items-center">
              {symbol.toUpperCase()}
              <button
                onClick={() => handleRemoveSymbol(symbol)}
                className="ml-2 text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <BinanceWebSocket symbols={symbols} />
    </div>
  );
}