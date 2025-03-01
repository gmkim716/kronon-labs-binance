import {OHLCProps} from "@/types/chart";

export const OHLCInfo = ({ currentOHLC, dateStr }: {currentOHLC:OHLCProps, dateStr: string}) => {

  return (
    <div className="absolute top-0 left-0 z-10 p-2 text-sm flex flex-wrap w-[480px]">
      <div className="w-full flex flex-wrap items-center">
        <span className="text-gray-400">{dateStr}</span>
        <span className="ml-1">Open:</span>
        <span className={currentOHLC.open < currentOHLC.close ? 'text-green-500' : 'text-red-500'}>
          {currentOHLC.open.toFixed(2)}
        </span>
        <span className="ml-1">High:</span>
        <span className="text-green-500">{currentOHLC.high.toFixed(2)}</span>
        <span className="ml-1">Low:</span>
        <span className="text-red-500">{currentOHLC.low.toFixed(2)}</span>
        <span className="ml-1">Close:</span>
        <span className={currentOHLC.open < currentOHLC.close ? 'text-green-500' : 'text-red-500'}>
          {currentOHLC.close.toFixed(2)}
        </span>
        <span className="font-medium">CHANGE:</span>
        <span className={currentOHLC.change >= 0 ? 'text-green-500' : 'text-red-500'}>
          {currentOHLC.change >= 0 ? '+' : ''}{currentOHLC.changePercent.toFixed(2)}%
        </span>
        <span className="font-medium">AMPLITUDE:</span>
        <span className="text-blue-400">{currentOHLC.amplitude.toFixed(2)}%</span>
      </div>
    </div>
  )
}