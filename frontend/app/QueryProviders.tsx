'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

export default function QueryProviders({ children }: { children: ReactNode }) {
  // 클라이언트 컴포넌트 내에서 QueryClient 인스턴스 생성
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}