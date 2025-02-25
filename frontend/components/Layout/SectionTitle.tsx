interface SectionTitleProps {
  title: string;
}

export const SectionTitle = ({title} : SectionTitleProps) => {
  return (
    <div className="text-white">
      {title}
    </div>
  )
}