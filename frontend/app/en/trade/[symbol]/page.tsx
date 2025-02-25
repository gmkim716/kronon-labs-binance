interface TradePageProps {
  params: {sid: string}
}

export default function TradePage({params}: TradePageProps ) {
  
  return (
    <div>
      {params.sid}
    </div>
  )
}