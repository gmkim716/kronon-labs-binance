'use client';

import {useEffect} from 'react';
import {BINANCE_URL} from "../constants";
import {useQuery} from "@tanstack/react-query";

// 마켓 항목 타입 정의
export interface MarketItem {
  symbol: string;         // 심볼 (BTCUSDT)
  baseAsset: string;      // 기초 자산 (BTC)
  quoteAsset: string;     // 견적 자산 (USDT)
  lastPrice: number;      // 마지막 가격
  priceChangePercent: number; // 24시간 변동률
  leverage?: string;      // 레버리지 (5x)
  isFavorite?: boolean;   // 즐겨찾기 여부
  volume?: number;  // 야
}

// 마켓 목록 필터 옵션
interface UseMarketListOptions {
  quoteAsset?: string;    // 견적 자산으로 필터링 (USDT, BTC 등)
  onlyFavorites?: boolean; // 즐겨찾기만 표시
}

interface TickerData {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  volume: string;
  [key: string]: any;     // 기타 속성
}

// 마켓 데이터 가져오는 함수
const fetchMarkets = async ({ quoteAsset="USDT", onlyFavorites }: UseMarketListOptions) => {
  // 티커 정보 가져오기
  const tickerResponse = await fetch(`${BINANCE_URL}/ticker/24hr`);
  if (!tickerResponse.ok) {
    throw new Error(`마켓 정보를 가져오는데 실패했습니다: ${tickerResponse.status}`);
  }
  
  const tickerData = await tickerResponse.json();
  
  // 클라이언트 사이드에서만 실행되어야 하므로 localStorage 사용 주의
  // 실제 애플리케이션에서는 Zustand 스토어에서 가져와서 사용함
  let favorites = [];
  if (typeof window !== 'undefined') {
    // 클라이언트 사이드일 때만 localStorage 접근
    favorites = JSON.parse(localStorage.getItem('favoriteMarkets') || '[]');
  }
  
  // 마켓 데이터 처리
  const processedMarkets = tickerData
    // 필요한 심볼 필터링
    .filter((ticker: TickerData) => ticker.symbol.endsWith(quoteAsset))
    // 데이터 변환
    .map((ticker: TickerData) => {
      // 심볼에서 기초 자산 추출 (BTCUSDT -> BTC)
      const baseAsset = ticker.symbol.replace(quoteAsset, '');
      
      // 레버리지 정보 (실제로는 다른 API에서 가져와야 할 수 있음)
      const leverage = '5x'; // 예시 데이터
      
      return {
        symbol: ticker.symbol,
        baseAsset,
        quoteAsset,
        lastPrice: parseFloat(ticker.lastPrice),
        priceChangePercent: parseFloat(ticker.priceChangePercent),
        volume: parseFloat(ticker.volume),
        leverage,
        isFavorite: favorites.includes(ticker.symbol)
      };
    })
    // 가격 변동률로 정렬 (선택사항)
    .sort((a: MarketItem, b: MarketItem) => b.priceChangePercent - a.priceChangePercent);
  
  // 즐겨찾기 필터링
  return onlyFavorites
    ? processedMarkets.filter((m: MarketItem) => m.isFavorite)
    : processedMarkets;
};

export function useMarketList(options: UseMarketListOptions = {}) {
  const { quoteAsset = 'USDT', onlyFavorites = false } = options;
  
  // window 객체는 클라이언트 사이드에서만 접근 가능하기 때문에
  // useEffect 내에서 favorites를 처리하기 위한 로직이 필요함
  useEffect(() => {
    // 컴포넌트가 마운트될 때만 실행되는 클라이언트 사이드 로직
  }, []);
  
  return useQuery<MarketItem[], Error>({
    queryKey: ['markets', quoteAsset, onlyFavorites],
    queryFn: () => fetchMarkets({ quoteAsset, onlyFavorites }),
    refetchInterval: 60000, // 1분마다 자동 갱신
    refetchOnWindowFocus: true, // 윈도우 포커스 시 갱신
    staleTime: 30000, // 30초 동안은 데이터가 "신선"하다고 간주
  });
}