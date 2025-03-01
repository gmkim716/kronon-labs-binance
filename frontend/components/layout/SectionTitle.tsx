import { SectionTitleProps} from "@/types/layout";

export const SectionTitle = ({title, className} : SectionTitleProps) => {
  return (
    <div className={`text-white ${className}`}>
      {title}
    </div>
  )
}