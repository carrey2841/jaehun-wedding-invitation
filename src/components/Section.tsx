import type { ReactNode } from 'react'
import styles from './Section.module.css'

interface SectionProps {
  children: ReactNode
  className?: string
  /** 섹션 구분용 id (앵커 등) */
  id?: string
}

export function Section({ children, className = '', id }: SectionProps) {
  return (
    <section id={id} className={`${styles.section} ${className}`.trim()}>
      {children}
    </section>
  )
}
