import { Chart } from "@/components/chart/Chart";

export default async function ChartRoute({ params }: { params: { symbol: string } }) {
  // 여기서 데이터를 불러오거나 처리할 수 있습니다
  return <Chart symbol={params.symbol} />;
}