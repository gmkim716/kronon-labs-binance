import { Chart } from "@/components/chart/Chart";

export default async function ChartRoute({ params }: { params: { symbol: string } }) {
  return <Chart symbol={params.symbol} />;
}