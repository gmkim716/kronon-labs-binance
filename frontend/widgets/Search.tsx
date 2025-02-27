'use client'

import {SearchInput} from "@/components/search/SearchInput";
import {SectionLayout} from "@/components/layout/SectionLayout";
import {SectionHeaderLayout} from "@/components/layout/SectionHeaderLayout";
import {SectionContentLayout} from "@/components/layout/SectionContentLayout";
import {SearchItem} from "@/components/search/SearchItem";
import {useMarketList} from "@/lib/hooks/useMarketList";

export const Search = () => {
  const {markets} = useMarketList()
  
  // todo: 상위 n개만 먼저 렌더링, 동작 시에 이벤트로 로드 해서 성능 최적화 방법 고민하기
  // todo: react query 사용으로 고민해보자
  // const slicedMarkets = markets?.slice(0, 10);
  
  return (
    <SectionLayout
      header={
        <SectionHeaderLayout>Search</SectionHeaderLayout>
      }
      content={
        <SectionContentLayout>
          <SearchInput />
          {markets.map((item) => (
            <SearchItem
              baseAsset={item.baseAsset}
              isFavorite={item.isFavorite}
              leverage={item.leverage}
              lastPrice={item.lastPrice}
              priceChangePercent={item.priceChangePercent}
              volume={item.volume}
            />
          ))}
        </SectionContentLayout>
      }
    />
  )
}