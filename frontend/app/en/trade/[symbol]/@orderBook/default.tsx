import { OrderBook } from "@/components/orderBook/OrderBook";

export default async function OrderBookRoute({ params }: { params: { symbol: string } }) {
  return <OrderBook symbol={params.symbol} />;
}