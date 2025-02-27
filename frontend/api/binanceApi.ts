import axios from 'axios'
import {BINANCE_URL, BINANCE_WEBSOCKET} from "@/lib/consts";

export const binanceApi = {
  // Get exchange information (all trading pairs)
  getExchangeInfo: async () => {
    const response = await axios.get(`${BINANCE_URL}/exchangeInfo`)
    return response.data
  },
  
  // Get ticker price for all symbols or a specific symbol
  getTickerPrice: async (symbol?: string) => {
    const url = symbol
      ? `${BINANCE_URL}/ticker/price?symbol=${symbol}`
      : `${BINANCE_URL}/ticker/price`
    const response = await axios.get(url)
    return response.data
  },
  
  // Get 24hr ticker statistics
  get24hrStats: async (symbol?: string) => {
    const url = symbol
      ? `${BINANCE_URL}/ticker/24hr?symbol=${symbol}`
      : `${BINANCE_URL}/ticker/24hr`
    const response = await axios.get(url)
    return response.data
  },
  
  // Get order book for a specific symbol
  getOrderBook: async (symbol: string, limit: number = 20) => {
    const response = await axios.get(`${BINANCE_URL}/depth?symbol=${symbol}&limit=${limit}`)
    return response.data
  },
  
  // Get klines (candlestick data)
  getKlines: async (symbol: string, interval: string, limit: number = 500) => {
    const response = await axios.get(
      `${BINANCE_URL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    )
    return response.data
  },
  
  // Get latest trades
  getTrades: async (symbol: string, limit: number = 500) => {
    const response = await axios.get(
      `${BINANCE_URL}/trades?symbol=${symbol}&limit=${limit}`
    )
    return response.data
  },
  
  // Get aggregated trades
  getAggTrades: async (symbol: string, limit: number = 500) => {
    const response = await axios.get(
      `${BINANCE_URL}/aggTrades?symbol=${symbol}&limit=${limit}`
    )
    return response.data
  },
  
  // Get current average price
  getAvgPrice: async (symbol: string) => {
    const response = await axios.get(`${BINANCE_URL}/avgPrice?symbol=${symbol}`)
    return response.data
  },
  
  // Get top bid/ask prices and quantities
  getBookTicker: async (symbol?: string) => {
    const url = symbol
      ? `${BINANCE_URL}/ticker/bookTicker?symbol=${symbol}`
      : `${BINANCE_URL}/ticker/bookTicker`
    const response = await axios.get(url)
    return response.data
  }
}

// WebSocket connections
export const createWebSocketConnection = (endpoint: string, callback: (data: any) => void) => {
  const ws = new WebSocket(`${BINANCE_WEBSOCKET}/${endpoint}`)
  
  ws.onopen = () => {
    console.log(`WebSocket connected: ${endpoint}`)
  }
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    callback(data)
  }
  
  ws.onerror = (error) => {
    console.error(`WebSocket error: ${endpoint}`, error)
  }
  
  ws.onclose = () => {
    console.log(`WebSocket closed: ${endpoint}`)
  }
  
  return {
    close: () => ws.close(),
    getStatus: () => ws.readyState,
  }
}

// WebSocket subscription factories
export const websocketStreams = {
  // Subscribe to ticker updates
  subscribeToTicker: (symbol: string, callback: (data: any) => void) => {
    const lowercaseSymbol = symbol.toLowerCase()
    return createWebSocketConnection(`${lowercaseSymbol}@ticker`, callback)
  },
  
  // Subscribe to order book updates
  subscribeToOrderBook: (symbol: string, callback: (data: any) => void) => {
    const lowercaseSymbol = symbol.toLowerCase()
    return createWebSocketConnection(`${lowercaseSymbol}@depth`, callback)
  },
  
  // Subscribe to kline/candlestick updates
  subscribeToKlines: (symbol: string, interval: string, callback: (data: any) => void) => {
    const lowercaseSymbol = symbol.toLowerCase()
    return createWebSocketConnection(`${lowercaseSymbol}@kline_${interval}`, callback)
  },
  
  // Subscribe to trade updates
  subscribeToTrades: (symbol: string, callback: (data: any) => void) => {
    const lowercaseSymbol = symbol.toLowerCase()
    return createWebSocketConnection(`${lowercaseSymbol}@trade`, callback)
  },
  
  // Subscribe to aggregate trade updates
  subscribeToAggTrades: (symbol: string, callback: (data: any) => void) => {
    const lowercaseSymbol = symbol.toLowerCase()
    return createWebSocketConnection(`${lowercaseSymbol}@aggTrade`, callback)
  },
  
  // Subscribe to multiple streams at once
  subscribeToMultipleStreams: (streams: string[], callback: (data: any) => void) => {
    const endpoint = streams.join('/')
    return createWebSocketConnection(endpoint, callback)
  },
  
  // Create a combined stream connection (method used in Binance API)
  createCombinedStream: (streams: string[], callback: (data: any) => void) => {
    // For combined streams, Binance uses a different endpoint structure
    const wsUrl = `${BINANCE_WEBSOCKET}/stream?streams=${streams.join('/')}`
    const ws = new WebSocket(wsUrl)
    
    ws.onopen = () => {
      console.log('Combined WebSocket connected')
    }
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      callback(data)
    }
    
    ws.onerror = (error) => {
      console.error('Combined WebSocket error:', error)
    }
    
    ws.onclose = () => {
      console.log('Combined WebSocket closed')
    }
    
    return {
      close: () => ws.close(),
      getStatus: () => ws.readyState,
    }
  }
}

// Constants for available intervals
export const klineIntervals = [
  '1m', '3m', '5m', '15m', '30m',   // minutes
  '1h', '2h', '4h', '6h', '8h', '12h',  // hours
  '1d', '3d',  // days
  '1w',        // week
  '1M'         // month
]

// Helper to format symbol
export const formatSymbol = (symbol: string): string => {
  return symbol.toUpperCase()
}