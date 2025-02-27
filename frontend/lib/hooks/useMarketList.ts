'use client';

import { useState, useEffect } from 'react';
import {BINANCE_URL} from "../constants";

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


/**
 * 바이낸스 마켓 목록을 가져오는 훅
 */
export function useMarketList(options: UseMarketListOptions = {}) {
  const [markets, setMarkets] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { quoteAsset = 'USDT', onlyFavorites = false } = options;
  
  useEffect(() => {
    const fetchMarkets = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 티커 정보 가져오기
        const tickerResponse = await fetch(`${BINANCE_URL}/ticker/24hr`);
        const tickerData = await tickerResponse.json();
        
        // 익스체인지 정보 가져오기 (심볼 메타데이터)
        const exchangeInfoResponse = await fetch(`${BINANCE_URL}/exchangeInfo`);
        const exchangeInfo = await exchangeInfoResponse.json();
        
        // 즐겨찾기 목록 로컬 스토리지에서 가져오기
        const favorites = JSON.parse(localStorage.getItem('favoriteMarkets') || '[]');
        
        // 마켓 데이터 처리
        const processedMarkets = tickerData
          // 필요한 심볼 필터링
          .filter((ticker: TickerData) => ticker.symbol.endsWith(quoteAsset))
          // 데이터 변환
          .map((ticker: TickerData) => {
            // 심볼에서 기초 자산 추출 (BTCUSDT -> BTC)
            const baseAsset = ticker.symbol.replace(quoteAsset, '');
            
            // 심볼 메타데이터 찾기
            // const symbolInfo = exchangeInfo.symbols.find(
            //   (s: any) => s.symbol === ticker.symbol
            // );
            
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
        const filteredMarkets = onlyFavorites
          ? processedMarkets.filter((m: MarketItem) => m.isFavorite)
          : processedMarkets;
        
        setMarkets(filteredMarkets);
      } catch (err: any) {
        console.error('마켓 목록 가져오기 오류:', err);
        setError(err.message || '마켓 목록을 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMarkets();
    
    // 1분마다 데이터 업데이트 (선택사항)
    const intervalId = setInterval(fetchMarkets, 60000);
    
    return () => clearInterval(intervalId);
  }, [quoteAsset, onlyFavorites]);
  
  // 즐겨찾기 토글 함수
  const toggleFavorite = (symbol: string) => {
    const favorites = JSON.parse(localStorage.getItem('favoriteMarkets') || '[]');
    
    let newFavorites;
    if (favorites.includes(symbol)) {
      newFavorites = favorites.filter((s: string) => s !== symbol);
    } else {
      newFavorites = [...favorites, symbol];
    }
    
    localStorage.setItem('favoriteMarkets', JSON.stringify(newFavorites));
    
    // 마켓 리스트 업데이트
    setMarkets(markets.map(market =>
      market.symbol === symbol
        ? { ...market, isFavorite: !market.isFavorite }
        : market
    ));
  };
  
  return {
    markets,
    loading,
    error,
    toggleFavorite
  };
}