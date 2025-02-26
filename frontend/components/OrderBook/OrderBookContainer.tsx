'use client'

import {QueryClientProvider, useQuery, useQueryClient} from "@tanstack/react-query";
import {OrderBook} from "@/widgets/OrderBook";
import {useBinanceWebSocket} from "@/lib/hooks/useBinanceWebSocket";

export default function OrderBookContainer({ symbol = "btcusdt" }) {
  const queryClient = useQueryClient();
  
  // 웹 소켓 연결 및 데이터 수신 처리
  const { isConnected } = useBinanceWebSocket(symbol, (data) => {
    // 웹소켓에서 받은 데이터로 React Query 캐시 업데이트
    queryClient.setQueryData(['orderbook', symbol], data);
  })
  
  
  // 캐시된 데이터 사용
  const { data } = useQuery(({
    queryKey: ['orderbook', symbol],
    // 초기 데이터는 API에서 가져옵니다
    queryFn: async  () => {
      const response = await fetch(`/api/orderbook?symbol=${symbol}`);
      return response.json();
    },
    // 웹 소켓에서 업데이트되므로 리패칭 비활성화
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  }))
  
  
  // 데이터 처리 및 변환 로직
  const { buyList, sellList, realtime } = data || {
    buyList: [],
    sellList: [],
    realtime: {type: 'none', price: 0}
  }
  
  
  return (
    <QueryClientProvider client={queryClient}>
      <OrderBook realtime={realtime} buyList={buyList} sellList={sellList} />
    </QueryClientProvider>
  )
}