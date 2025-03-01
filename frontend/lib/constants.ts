// API 경로
export const BINANCE_URL = 'https://api.binance.com/api/v3'
export const BINANCE_WEBSOCKET = "wss://stream.binance.com:9443/ws"

// 숫자
export const ORDER_BOOK_DEPTH = 20;

// 그래프 간격 기간
export enum KLINE_INTERVALS {
  MINUTE = '1m',
  THREE_MINUTES = '3m',
  FIVE_MINUTES = '5m',
  FIFTEEN_MINUTES = '15m',
  THIRTY_MINUTES = '30m',
  HOUR = '1h',
  TWO_HOURS = '2h',
  FOUR_HOURS = '4h',
  SIX_HOURS = '6h',
  EIGHT_HOURS = '8h',
  TWELVE_HOURS = '12h',
  DAY = '1d',
  THREE_DAYS = '3d',
  WEEK = '1w',
  MONTH = '1M'
};

// 그래프
export enum COLOR {
   BUY_COLOR = "#2EBD85",
   SELL_COLOR = "#F6465D"
}

// 그래프 데이터 개수
export const DATA_LIMIT = 100;