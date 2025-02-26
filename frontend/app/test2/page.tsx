import BinanceWebSocket from "@/components/Test/BinanceWebSocket";

export default function Test2Page () {
  
  const symbols = ['btcusdt']
  return (
    <div>
      <BinanceWebSocket symbols={symbols} />
    </div>
  )
}