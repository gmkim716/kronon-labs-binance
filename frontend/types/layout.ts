import {ReactNode} from "react";

export interface SectionTitleProps {
  title: string;
  className?: string;
}

export interface SectionLayoutProps {
  header: ReactNode
  content: ReactNode
  className?: string;
}
