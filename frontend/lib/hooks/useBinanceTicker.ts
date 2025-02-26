import { useQuery } from "@tanstack/react-query";

export function useBinanceTicker(symbol: string) {
  return useQuery({
    queryKey: ['binance-ticker', symbol.toLowerCase()],
    queryFn: async () => {
      const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol.toUpperCase()}`);
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