import React, {ReactNode} from "react";

export const SectionContentLayout = ({children, className}: {children: ReactNode, className?: string}) => {
  return (
    <div className={`px-4 ${className}`}>
      {children}
    </div>
  )
}