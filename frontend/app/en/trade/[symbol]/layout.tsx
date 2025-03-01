import React, {ReactNode} from "react";

export default function TradeLayout({
                                      orderBook,
                                      chart,
                                      search,
                                    }: {
  orderBook: ReactNode;
  chart: ReactNode;
  search: ReactNode;
}) {
  return (
    <div className="flex">
      <div className="w-1/4">{orderBook}</div>
      <div className="w-2/4">{chart}</div>
      <div className="w-1/4">{search}</div>
    </div>
  );
}