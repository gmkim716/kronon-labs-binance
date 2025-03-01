'use client'

import {useSearchStore} from "@/store/useSearchStore";
import {ChangeEvent} from "react";

export const SearchInput = () => {
  
  const {searchQuery, setSearchQuery} = useSearchStore();
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  return (
    <input
      type="text"
      className="w-full pl-4 pr-4 py-2 bg-gray-800 border-none rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary"
      placeholder="Search"
      value={searchQuery}
      onChange={handleChange}
    />
  )
}