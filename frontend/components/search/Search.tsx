import {SearchInput} from "@/components/search/SearchInput";
import {SectionLayout} from "@/components/layout/SectionLayout";
import {SectionHeaderLayout} from "@/components/layout/SectionHeaderLayout";
import {SectionContentLayout} from "@/components/layout/SectionContentLayout";
import {SearchResultList} from "@/components/search/SearchResultList";

export const Search = () => {
  return (
    <SectionLayout
      header={
        <SectionHeaderLayout>Search</SectionHeaderLayout>
      }
      content={
        <SectionContentLayout>
          <SearchInput />
          <SearchResultList />
        </SectionContentLayout>
      }
    />
  )
}