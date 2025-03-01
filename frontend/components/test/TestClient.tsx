// components/test/TestClient.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {fetchBinanceData} from "@/components/test/testApi";

export function TestClient() {
  // 데이터 로딩 상태 트래킹
  const [isManualFetching, setIsManualFetching] = useState(false);
  
  // React Query 호출
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['binancePrice'],
    queryFn: fetchBinanceData,
    staleTime: 10000, // 10초 동안 최신 상태 유지
    refetchInterval: 30000, // 30초마다 자동 갱신
    enabled: true, // 컴포넌트 마운트 시 자동으로 데이터 가져오기
  });
  
  // 수동 리패치 핸들러
  const handleRefetch = async () => {
    setIsManualFetching(true);
    await refetch();
    setIsManualFetching(false);
  };
  
  return (
    <div className="border p-4 rounded-lg max-w-md">
      <h2 className="text-xl font-semibold mb-2">바이낸스 BTC/USDT 가격</h2>
      
      {isLoading ? (
        <p className="text-gray-500">로딩 중...</p>
      ) : error ? (
        <p className="text-red-500">에러 발생: {(error as Error).message}</p>
      ) : (
        <div>
          <p className="text-2xl font-bold">${parseFloat(data?.price).toFixed(2)}</p>
          <p className="text-xs text-gray-500">
            마지막 업데이트: {new Date().toLocaleTimeString()}
          </p>
        </div>
      )}
      
      <div className="mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          onClick={handleRefetch}
          disabled={isLoading || isFetching || isManualFetching}
        >
          {isFetching ? '데이터 가져오는 중...' : '수동 새로고침'}
        </button>
        
        {isFetching && !isManualFetching && (
          <p className="text-xs text-gray-500 mt-1">백그라운드에서 데이터 갱신 중...</p>
        )}
      </div>
      
      <div className="mt-4 p-2 bg-gray-100 rounded">
        <h3 className="font-medium mb-1">원시 데이터:</h3>
        <pre className="text-xs overflow-auto">{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}