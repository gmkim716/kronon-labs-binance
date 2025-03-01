// lib/api/testApi.ts
// 서버와 클라이언트 모두에서 작동하는 함수
export async function fetchBinanceData() {
  // 간단한 바이낸스 API 엔드포인트 (심볼 가격)
  const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
}