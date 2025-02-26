import {SectionTitleProps} from "@/components/Layout/types";

export const SectionTitle = ({title} : SectionTitleProps) => {
  return (
    <div className="text-white">
      {title}
    </div>
  )
}