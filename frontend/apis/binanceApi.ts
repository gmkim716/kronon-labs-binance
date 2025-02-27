import axios from 'axios'
import {BINANCE_URL, BINANCE_WEBSOCKET} from "../lib/constants";

// Binance API 관련 함수들
export const binanceApi = {
  // 거래소 정보 가져오기 (모든 거래쌍)
  getExchangeInfo: async () => {
    const response = await axios.get(`${BINANCE_URL}/exchangeInfo`)
    return response.data
  },
  
  // 특정 심볼 또는 모든 심볼의 가격 가져오기
  getTickerPrice: async (symbol?: string) => {
    const url = symbol
      ? `${BINANCE_URL}/ticker/price?symbol=${symbol}`
      : `${BINANCE_URL}/ticker/price`
    const response = await axios.get(url)
    return response.data
  },
  
  // 24시간 시세 통계 가져오기
  get24hrStats: async (symbol?: string) => {
    const url = symbol
      ? `${BINANCE_URL}/ticker/24hr?symbol=${symbol}`
      : `${BINANCE_URL}/ticker/24hr`
    const response = await axios.get(url)
    return response.data
  },
  
  // 특정 심볼의 오더북 가져오기
  getOrderBook: async (symbol: string, limit: number = 20) => {
    const response = await axios.get(`${BINANCE_URL}/depth?symbol=${symbol}&limit=${limit}`)
    return response.data
  },
  
  // 캔들스틱 데이터(klines) 가져오기
  getKlines: async (symbol: string, interval: string, limit: number = 500)=> {
    const response = await axios.get(
      `${BINANCE_URL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    )
    return response.data
  },
  
  // 최신 거래 내역 가져오기
  getTrades: async (symbol: string, limit: number = 500) => {
    const response = await axios.get(
      `${BINANCE_URL}/trades?symbol=${symbol}&limit=${limit}`
    )
    return response.data
  },
  
  // 집계된 거래 내역 가져오기
  getAggTrades: async (symbol: string, limit: number = 500) => {
    const response = await axios.get(
      `${BINANCE_URL}/aggTrades?symbol=${symbol}&limit=${limit}`
    )
    return response.data
  },
  
  // 현재 평균 가격 가져오기
  getAvgPrice: async (symbol: string) => {
    const response = await axios.get(`${BINANCE_URL}/avgPrice?symbol=${symbol}`)
    return response.data
  },
  
  // 최고 매도/매수 가격 및 수량 가져오기
  getBookTicker: async (symbol?: string) => {
    const url = symbol
      ? `${BINANCE_URL}/ticker/bookTicker?symbol=${symbol}`
      : `${BINANCE_URL}/ticker/bookTicker`
    const response = await axios.get(url)
    return response.data
  }
}
