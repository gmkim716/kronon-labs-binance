# kronon-labs-binance 과제 진행

- Time limits: 2025-02-25 ~ 2025-03-01(5d)
- Main stack: Next.js 15, app router
- Libraries: tanstack query, 

## Challenging Points

### Summary

- day 1-2: Binance API 사용법 확인
- day 2-5: 최소 구현항목 구현
- day 5: 웹 페이지 배포

### Details

- 업무 외 시간을 활용해야 하다보니, 1. 빠르게 동작하는 것을 확인, 2. 관심사 분리 및 코드 리팩토링, 3. 구현 항목 정리 방식으로 진행 계획을 세웠습니다.
- app router 사용법에 대해 학습한 적이 있지만, 업무 중에는 page router 방식을 다루다보니 구현 과정이 익숙하진 않았습니다. 지식으로 알고만 있었던 동적 라우팅 적용, 병렬 경로 적용을 직접 구현해보면서 경험할 수 있었습니다.
- tanstack query 적용을 위해 Provider를 구현하면서 SSR/CSR 동작 과정에 대해 이해가 잘 가지 않았습니다. 기존에는 'use client'로 감싸진 부모 컴포넌트 아래 모든 컴포넌트들이 CSR로 동작하는 것으로 이해하고 있었는데, provider 자체는 클라이언트에서 실행되지만, 그 안에 포함된 서버 컴포넌트들은 여전히 서버로부터 렌더링 된다는 점을 알게 되었습니다.
- 업무 중에 주가 차트 라이브러리(React Financial Charts)를 이용해 본적이 있었지만, 불친절한 공식문서, 범용적이지 않은 사용성으로 인해 불편함을 느끼고 있었습니다. 기회가 된다면 TradingView Lightweight을 사용한 그래프 구현에 도전해보고 싶었는데, 과제를 계기로 도전해볼 수 있었습니다.
- 최대한 컴포넌트를 잘게 쪼갤 수 있도록 했습니다. 유지보수의 가능성, 협업과정에서 발생할 수 있는 의사소통의 어려움을 줄이기 위해 가급적 파일을 분리할 수 있도록 노력했습니다
- 업무에서는 주로 FSD 방식의 폴더 아키텍처를 사용중입니다. 하지만 과제에서 구현해야 하는 내용이 복잡하지 않기 때문에 가급적 직관적인 폴더 구조를 다룰 수 있도록 수정했습니다. 전역에서 사용될 수 있는 api, utils, lib, store 파일의 경우에는 모듈로 관리하지 않고 루트 경로에 분리시켰습니다.
- 간단하게 웹 페이지 배포를 위해 vercel을 이용했습니다. AWS를 사용해 배포해야 했던 이전의 경험과 달리 매우 간단하게 배포해볼 수 있어서 편리함을 체감할 수 있었습니다.