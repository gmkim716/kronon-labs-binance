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
  
  // todo: 좋아요 표시에 대해서 react query 적용할게 있을 것
  
  return (
    <div className="grid grid-cols-3">
      <div className="flex">
        <span>{favorite}</span>
        <span>{baseAsset}</span>
        {badge}
      </div>
      <div>{lastPrice}</div>
      <div>{priceChangePercent}%</div>
      {/*<div>{volume}</div>*/}
    </div>
  )
}