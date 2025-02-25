import {SectionTitle} from "@/components/Layout/SectionTitle";

interface SectionLayoutProps {
  title: string,
  children: React.ReactNode
}

export const SectionLayout = ({ title, children }: SectionLayoutProps) => {
  return (
    <div className="bg-[#181920]">
      <SectionTitle title={title} />
      <hr className="border-0 bg-gray-700 h-px w-full"/>
      {children}
    </div>
  )
}