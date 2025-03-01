// 소수점 2째자리 숫자 + 단위를 나타내는 기호 적용
export const formatNumber = (num: number, precision: number = 5) => {
  const absNum = Math.abs(num);
  
  if (absNum >= 1000000000000) {
    return (num / 1000000000000).toFixed(2) + 'T';
  }
  if (absNum >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B';
  }
  if (absNum >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (absNum >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  
  return num.toFixed(precision);
};

// // symbol을 UpperCase로 변경
// export const formatSymbol = (symbol: string): string => {
//   return symbol.toUpperCase()
// }


// timestamp를 'yyyy-MM-dd' 형태로 변환
// const formatTimestampToDate = (klineTime: number) => {
//   const date = new Date(klineTime);
//   return date.toISOString().split("T")[0];
// }


// // Array 형태로 전달되는 Kline 데이터를 tradingView lightweight에 적합한 형태로 반환합니다
// export const transformKlineToChartData = (kline: any[]): {
//   time: string;
//   open: number;
//   high: number;
//   low: number;
//   close: number;
//   volume?: number;
// } => {
//   const [timeMs, open, high, low, close, volume] = kline;
//
//   // 밀리초를 'YYYY-MM-DD' 문자열로 변환
//   const dateString = new Date(timeMs).toISOString().split('T')[0];
//
//   return {
//     time: dateString,
//     open: parseFloat(open),
//     high: parseFloat(high),
//     low: parseFloat(low),
//     close: parseFloat(close),
//     volume: parseFloat(volume),
//   };
// };