import axios from 'axios'
import {BINANCE_URL} from "@/lib/constants";

export const binanceApi = {
  getKlines: async (symbol: string, interval: string, limit: number = 500)=> {
    const response = await axios.get(
      `${BINANCE_URL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    )
    return response.data
  },
  
}
