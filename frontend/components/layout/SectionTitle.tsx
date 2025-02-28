import { SectionTitleProps} from "@/components/layout/types";

export const SectionTitle = ({title} : SectionTitleProps) => {
  return (
    <div className="text-white">
      {title}
    </div>
  )
}