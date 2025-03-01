'use client'

import {useMarketList} from "@/lib/hooks/useMarketList";
import {SearchItem} from "@/components/search/SearchItem";
import {useSearchStore} from "@/store/useSearchStore";
import Link from "next/link";

export const SearchResultList = () => {
  
  const {data: markets} = useMarketList()
  
  const {searchQuery} = useSearchStore()
  
  const filteredResults = markets?.filter(
    (item) =>
      item.baseAsset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];
  
  return (
    <div className="bg-[#1E1E1E] border border-[#333] rounded overflow-hidden">
      <div className="max-h-[700px] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
      {filteredResults.map((item, index) => (
        <Link key={index} href={`/en/trade/${item.baseAsset}USDT`}>
          <SearchItem
            baseAsset={item.baseAsset}
            isFavorite={item.isFavorite}
            leverage={item.leverage}
            lastPrice={item.lastPrice}
            priceChangePercent={item.priceChangePercent}
            volume={item.volume}
          />
        </Link>
      ))}
      </div>
    </div>
  )
}