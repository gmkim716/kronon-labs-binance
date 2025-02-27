import {BINANCE_WEBSOCKET} from "@/lib/constants";

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