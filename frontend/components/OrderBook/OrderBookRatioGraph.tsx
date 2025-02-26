export const OrderBookRatioGraph = ({askRatio}: {askRatio: number}) => {
  return (
    <div className="flex w-full h-2 rounded-full overflow-hidden gap-1">
      <div className="bg-green-500 h-full" style={{ width: `${askRatio}%` }} />
      <div className="bg-red-500 h-full" style={{ width: `${100-askRatio}%` }} />
    </div>
  );
}