interface SearchItemProps {
  baseAsset: string;
  isFavorite?: boolean;
  lastPrice: number;
  leverage?: string;
  priceChangePercent: number;
  volume?: number;
}

export const SearchItem = ({baseAsset, isFavorite, lastPrice, leverage, priceChangePercent}: SearchItemProps) => {
  
  const favorite = isFavorite ? '★' : '☆';
  const badge = leverage && <div className="border border-blue-800 bg-blue-950">{leverage}%</div>
  
  let priceChangeColor = '';
  if (priceChangePercent > 0) {
    priceChangeColor = 'text-green-500';
  } else if (priceChangePercent < 0) {
    priceChangeColor = 'text-red-500';
  }
  
  return (
    <div className="grid grid-cols-3 text-xs py-0.5">
      <div className="flex gap-1">
        <span>{favorite}</span>
        <span>{baseAsset}</span>
        {badge}
      </div>
      <div className="text-right">{lastPrice}</div>
      <div className={`text-right ${priceChangeColor}`}>
        {priceChangePercent}%
      </div>
    </div>
  )
}