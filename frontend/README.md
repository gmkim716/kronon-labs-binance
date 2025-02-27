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