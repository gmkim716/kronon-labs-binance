export interface Kline {
  openTime: number;            // 열리는 시간 (밀리초 단위) c
  open: string;                // 시작 가격  v
  high: string;                // 최고 가격  v
  low: string;                 // 최저 가격  v
  close: string;               // 종료 가격  v
  volume: string;              // 거래량  v
  closeTime: number;           // 종료 시간 (밀리초 단위)
  quoteAssetVolume: string;    // 거래된 자산의 총액
  numberOfTrades: number;      // 거래 건수
  takerBuyBaseAssetVolume: string; // 매수 거래량 (기준 자산)
  takerBuyQuoteAssetVolume: string; // 매수 거래량 (호가 자산)
  ignore: string;              // 무시할 필드 ??
}

export interface KlineResponse {
  symbol: string;            // 심볼 (예: 'BTCUSDT')
  interval: string;          // 시간 간격 (예: '1m', '5m', '1h' 등)
  klines: Kline[];           // Kline 데이터 배열
}

interface ChartDataPoint {
  time: string;  // 'YYYY-MM-DD' 형식의 날짜 문자열
  open: number;  // 시가
  high: number;  // 고가
  low: number;   // 저가
  close: number; // 종가
  volume?: number; // 거래량
}
