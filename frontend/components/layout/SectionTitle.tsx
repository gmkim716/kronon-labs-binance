import { SectionTitleProps} from "@/components/layout/types";

export const SectionTitle = ({title, className} : SectionTitleProps) => {
  return (
    <div className={`text-white ${className}`}>
      {title}
    </div>
  )
}