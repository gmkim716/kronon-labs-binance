import { useQuery } from "@tanstack/react-query";
import {BINANCE_URL} from "@/lib/consts";

export function useBinanceTicker(symbol: string) {
  return useQuery({
    queryKey: ['binance-ticker', symbol.toLowerCase()],
    queryFn: async () => {
      const response = await fetch(`${BINANCE_URL}/ticker/24hr?symbol=${symbol.toUpperCase()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch ticker data');
      }
      return response.json();
    },
    // 옵션들도 같은 객체 안에 포함
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    refetchOnReconnect: true,
  });
}