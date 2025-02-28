import { BINANCE_WEBSOCKET } from "@/lib/constants";

// WebSocket 연결을 생성하는 함수
export const createWebSocketConnection = (endpoint: string, callback: (data: any) => void) => {
  const ws = new WebSocket(`${BINANCE_WEBSOCKET}/${endpoint}`);
  
  ws.onopen = () => {
    console.log(`WebSocket 연결 완료: ${endpoint}`);
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    callback(data);
  };
  
  ws.onerror = (error) => {
    console.error(`WebSocket 에러 발생: ${endpoint}`, error);
  };
  
  ws.onclose = () => {
    console.log(`WebSocket 연결 종료: ${endpoint}`);
  };
  
  return {
    close: () => ws.close(),
    getStatus: () => ws.readyState,
  };
};

// WebSocket 구독 생성자(팩토리) 모음
export const websocketStreams = {
  // 티커(Ticker) 업데이트를 구독
  subscribeToTicker: (symbol: string, callback: (data: any) => void) => {
    const lowercaseSymbol = symbol.toLowerCase();
    return createWebSocketConnection(`${lowercaseSymbol}@ticker`, callback);
  },
  
  // 주문장(Order Book) 업데이트를 구독
  subscribeToOrderBook: (symbol: string, callback: (data: any) => void) => {
    const lowercaseSymbol = symbol.toLowerCase();
    return createWebSocketConnection(`${lowercaseSymbol}@depth`, callback);
  },
  
  // K라인(캔들스틱) 업데이트를 구독
  subscribeToKlines: (symbol: string, interval: string, callback: (data: any) => void) => {
    const lowercaseSymbol = symbol.toLowerCase();
    return createWebSocketConnection(`${lowercaseSymbol}@kline_${interval}`, callback);
  },
  
  // 거래(Trade) 업데이트를 구독
  subscribeToTrades: (symbol: string, callback: (data: any) => void) => {
    const lowercaseSymbol = symbol.toLowerCase();
    return createWebSocketConnection(`${lowercaseSymbol}@trade`, callback);
  },
  
  // 묶음 거래(Aggregate Trade) 업데이트를 구독
  subscribeToAggTrades: (symbol: string, callback: (data: any) => void) => {
    const lowercaseSymbol = symbol.toLowerCase();
    return createWebSocketConnection(`${lowercaseSymbol}@aggTrade`, callback);
  },
  
  // 여러 스트림을 동시에 구독
  subscribeToMultipleStreams: (streams: string[], callback: (data: any) => void) => {
    const endpoint = streams.join('/');
    return createWebSocketConnection(endpoint, callback);
  },
  
  // 결합(Combined) 스트림 생성 (Binance API에서 사용되는 방식)
  createCombinedStream: (streams: string[], callback: (data: any) => void) => {
    // 결합 스트림의 경우, Binance는 다른 엔드포인트 구조를 사용함
    const wsUrl = `${BINANCE_WEBSOCKET}/stream?streams=${streams.join('/')}`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('결합 WebSocket 연결 완료');
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };
    
    ws.onerror = (error) => {
      console.error('결합 WebSocket 에러 발생:', error);
    };
    
    ws.onclose = () => {
      console.log('결합 WebSocket 연결 종료');
    };
    
    return {
      close: () => ws.close(),
      getStatus: () => ws.readyState,
    };
  },
};
