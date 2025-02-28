import {SectionLayoutProps} from "@/components/layout/types";


export const SectionLayout = ({ header, content }: SectionLayoutProps) => {
  return (
    <div className="bg-[#181920] pt-2 rounded-xl">
      <div className='text-xl font-bold px-4 py-2'>
        {header}
      </div>
      
      <hr className="border-0 bg-gray-700 h-px w-full"/>
      
      <div className="px-4 py-2">
        {content}
      </div>
    </div>
  )
}