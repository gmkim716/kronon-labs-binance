import {SectionLayoutProps} from "@/types/layout";

export const SectionLayout = ({ header, content, className }: SectionLayoutProps) => {
  return (
    <div className={`bg-[#181920] pt-2 rounded-xl ${className}`}>
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