'use client'

import {useMarketList} from "@/lib/hooks/useMarketList";
import {SearchItem} from "@/components/search/SearchItem";
import {useSearchStore} from "@/components/search/useSearchStore";

export const SearchResultList = () => {
  
  // 검색어가 없을 때, 거래 종목들을 보여주기 위한 초기 데이터 리스트 호출
  const {markets, isLoading, error} = useMarketList()
  
  // searchStore에서 관리되는 검색어 가져오기
  const {searchQuery} = useSearchStore()
  
  // 검색어에 따라 결과 필터링 진행
  const filteredResults = markets?.filter(
    (item) =>
      item.baseAsset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];
  
  return (
    <div>
      {filteredResults.map((item, index) => (
        <SearchItem
          key={index}
          baseAsset={item.baseAsset}
          isFavorite={item.isFavorite}
          leverage={item.leverage}
          lastPrice={item.lastPrice}
          priceChangePercent={item.priceChangePercent}
          volume={item.volume}
        />
      ))}
    </div>
  )
}