# Binance API를 이용한 코인 거래 창 구성하기 

## 주요 구현 목표 

- 코인 상품 검색, 리스트 
- 호가 창
- 코인 그래프

참고: https://www.binance.com/en/trade/BTC_USDT?type=spot

## 

## 후기

회사 업무로는 주로 Next.js 13 (page router) 방식으로 진행했습니다. 구현 목표에 맞춰 Next.js 15 버전, app router 방식을 다루면서 14에서와 달라진 부분을 일부 경험할 수 있었습니다.

- 동적라우팅 방식에 차이가 있는 것을 확인

SSR 컴포넌트에서의 fetch와 tanstack query의 사용법 분리에 대해 생각해 볼 수 있었습니다. 

## 구현 목표

### 호가창 (OrderBook.tsx)


### 캔들 차트 (Chart.tsx)

- RestAPI로 과거 데이터를 먼저 불러오고, 지속적인 변화가 일어나는 현재가는 WebSocket을 연결할 수 있도록 합니다

- BinanceAPI에서 제공하는 몇 가지 사용가능한 API를 훅으로 만들어 적용을 시도했으며 가장 최선으로 판단한 결과값을 선택합니다
  - @ticker: 거래가 발생할 때의 정보
  - @trade: 모든 거래에 대한 정보

  - orderbook에 사용되는 API 훅과, chart에 사용되는 API 훅이 다르기 때문에, 현재가격이 일부 동일하지 않을 수 있습니다 

### 검색 (Search.tsx)