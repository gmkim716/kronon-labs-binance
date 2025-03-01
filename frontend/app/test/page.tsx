// app/test/page.tsx
import { TestClient } from '@/components/test/TestClient';
import {OrderBook} from "@/components/orderBook/OrderBook";
import {Search} from "@/components/search/Search";
import {Chart} from "@/components/chart/Chart";

export default function TestPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">React Query 테스트 페이지</h1>
      <TestClient />
      <Chart symbol="BTCUSDT" />
      <OrderBook symbol="BTCUSDT" />
      <Search />
    </div>
  );
}