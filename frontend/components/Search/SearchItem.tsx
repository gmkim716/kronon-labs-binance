interface SearchItemProps {
  interest: boolean,
  name: string,
  times?: number,
  price: number,
  ratio: number
}

export const SearchItem = ({interest, times = 2, name, price, ratio}: SearchItemProps) => {
  
  const marker = interest ? '★' : '☆';
  const badge = times && <div className="border border-blue-800 bg-blue-950">{times}%</div>
  
  return (
    <div className="grid grid-cols-3">
      <div className="flex">
        <span>{marker}</span>
        <span>{name}</span>
        {badge}
      </div>
      <div>{price}</div>
      <div>{ratio}%</div>
    </div>
  )
}