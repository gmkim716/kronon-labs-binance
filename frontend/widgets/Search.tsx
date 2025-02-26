'use client'

import {SearchInput} from "@/components/Search/SearchInput";
import {SectionLayout} from "@/components/Layout/SectionLayout";
import {SectionHeaderLayout} from "@/components/Layout/SectionHeaderLayout";
import {SectionContentLayout} from "@/components/Layout/SectionContentLayout";
import {SearchItem} from "@/components/Search/SearchItem";
import {useMarketList} from "@/lib/hooks/useMarketList";

const TEMP_ITEM_LIST = [
  {
    interest: true,
    name: 'temp1',
    price: 100000,
    times: 5,
    ratio: 13.11
  },
  {
    interest: false,
    name: 'temp2',
    price: 12.323,
    ratio: 55412312315.1111123,
    times: 2,
  },
  {
    interest: true,
    name: 'temp1',
    price: 10.000000000000,
    ratio: 10.231
  },
]



export const Search = () => {
  const {markets} = useMarketList()

  console.log(markets)
  
  return (
    <SectionLayout
      header={
        <SectionHeaderLayout>Search</SectionHeaderLayout>
      }
      content={
        <SectionContentLayout>
          <SearchInput />
          {/*{TEMP_ITEM_LIST.map((item) => (*/}
          {/*  <SearchItem interest={item.interest} name={item.name} price={item.price} ratio={item.ratio} />*/}
          {/*))}*/}
        </SectionContentLayout>
      }
    />
  )
}