import {SectionLayoutProps} from "@/components/Layout/types";


export const SectionLayout = ({ header, content }: SectionLayoutProps) => {
  return (
    <div className="bg-[#181920]">
      <div className='text-xl font-bold'>
        {header}
      </div>
      <hr className="border-0 bg-gray-700 h-px w-full"/>
      {content}
    </div>
  )
}