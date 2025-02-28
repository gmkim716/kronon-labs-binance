import {COLOR} from "@/lib/constants";

export const OrderBookRatioGraph = ({askRatio}: {askRatio: number}) => {
  return (
    <div className="flex w-full h-2 rounded-full overflow-hidden gap-1">
      <div className="h-full" style={{ width: `${askRatio}%`, backgroundColor: COLOR.BUY_COLOR }} />
      <div className="h-full" style={{ width: `${100-askRatio}%`, backgroundColor: COLOR.SELL_COLOR}} />
    </div>
  );
}