import type {Metadata} from "next";
import "./globals.css";
import {ReactNode} from "react";
import QueryProviders from "@/providers/QueryProviders";

export const metadata: Metadata = {
  title: "프론트엔드 개발자 김경민",
  description: "크로논랩스 Binance 거래소 구현 과제 진행",
};


export default function RootLayout({children}: Readonly<{children: ReactNode}>) {
  return (
    <html lang="en" className="dark">
      <body className="flex justify-center">
        <QueryProviders>
          {children}
        </QueryProviders>
      </body>
    </html>
  );
}
