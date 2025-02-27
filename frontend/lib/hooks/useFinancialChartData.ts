'use client';

import { useQuery } from '@tanstack/react-query';

// 차트 데이터 타입 정의
export interface CandleData {
  time: number;       // 캔들 시간 (Unix timestamp)
  open: number;       // 시가
  high: number;       // 고가
  low: number;        // 저가
  close: number;      // 종가
  volume: number;     // 거래량
}

// 간격 타입
export type Interval = '1m' | '3m' | '5m' | '15m' | '30m' | '1h' | '2h' | '4h' | '6h' | '8h' | '12h' | '1d' | '3d' | '1w' | '1M';

// 옵션 타입 정의
interface UseChartDataOptions {
  symbol: string;     // 코인 심볼 (예: 'BTCUSDT')
  interval: Interval; // 차트 간격
  limit?: number;     // 캔들 개수 (최대 1000)
}

/**
 * 바이낸스 캔들스틱 차트 데이터를 가져오는 훅
 */
export function useFinancialChartData({ symbol, interval, limit = 500 }: UseChartDataOptions) {
  
  // 캔들스틱 데이터 가져오기
  const fetchCandleData = async () => {
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`차트 데이터를 가져오는데 실패했습니다: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // 반환된 배열 구조:
    // [
    //   [
    //     1499040000000,      // 캔들 시작 시간
    //     "0.01634790",       // 시가
    //     "0.80000000",       // 고가
    //     "0.01575800",       // 저가
    //     "0.01577100",       // 종가
    //     "148976.11427815",  // 거래량
    //     1499644799999,      // 캔들 종료 시간
    //     "2434.19055334",    // 견적 자산 거래량
    //     308,                // 거래 수
    //     "1756.87402397",    // 테이커 매수 기초 자산 거래량
    //     "28.46694368",      // 테이커 매수 견적 자산 거래량
    //     "17928899.62484339" // 무시 가능
    //   ]
    // ]
    
    return data.map((candle: any) => ({
      time: candle[0],
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
      volume: parseFloat(candle[5])
    }));
  };
  
  // React Query 사용
  return useQuery({
    queryKey: ['chartData', symbol, interval, limit],
    queryFn: fetchCandleData,
    refetchInterval: getRefetchInterval(interval), // 간격에 따른 적절한 refetch 간격 설정
    staleTime: getRefetchInterval(interval) / 2,
  });
}

// 차트 간격에 따른 refetch 간격 설정 (밀리초)
function getRefetchInterval(interval: Interval): number {
  const intervals: Record<Interval, number> = {
    '1m': 30 * 1000,    // 30초
    '3m': 60 * 1000,    // 1분
    '5m': 60 * 1000,    // 1분
    '15m': 3 * 60 * 1000, // 3분
    '30m': 5 * 60 * 1000, // 5분
    '1h': 10 * 60 * 1000, // 10분
    '2h': 20 * 60 * 1000, // 20분
    '4h': 30 * 60 * 1000, // 30분
    '6h': 45 * 60 * 1000, // 45분
    '8h': 60 * 60 * 1000, // 1시간
    '12h': 90 * 60 * 1000, // 1시간 30분
    '1d': 2 * 60 * 60 * 1000, // 2시간
    '3d': 6 * 60 * 60 * 1000, // 6시간
    '1w': 12 * 60 * 60 * 1000, // 12시간
    '1M': 24 * 60 * 60 * 1000, // 24시간
  };
  
  return intervals[interval] || 60 * 1000; // 기본값 1분
}