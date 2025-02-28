import {useQuery} from "@tanstack/react-query";
import {binanceApi} from "@/apis/binanceApi";

export const useKlines = (symbol: string, interval: string = '1d', limit: number = 50) => {
  
  return useQuery({
    queryKey: ["klines", symbol, interval, limit],
    queryFn: () => binanceApi.getKlines(symbol, interval, limit)
  })
}