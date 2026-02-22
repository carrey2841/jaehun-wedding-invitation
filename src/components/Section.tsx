import { useEffect, useRef, useState, type ReactNode } from 'react'
import styles from './Section.module.css'

interface SectionProps {
  children: ReactNode
  className?: string
  /** 섹션 구분용 id (앵커 등) */
  id?: string
}

export function Section({ children, className = '', id }: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
      },
      { rootMargin: '60px 0px -40px 0px', threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      id={id}
      className={`${styles.section} ${inView ? styles.sectionInView : ''} ${className}`.trim()}
    >
      {children}
    </section>
  )
}
