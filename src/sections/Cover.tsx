import { useState } from 'react'
import { Section } from '../components/Section'
import { useInvitationStore } from '../stores/invitationStore'
import styles from './Cover.module.css'

/** 메인 사진 기본 경로: public/cover.jpeg 에 넣으면 자동 표시 */
const DEFAULT_COVER_IMAGE = '/cover.jpeg'
/** /parent-v2 경로일 때만 사용 (기존 비율 이미지) */
const PARENT_COVER_IMAGE = '/cover-parent.jpeg'

const WEEKDAY_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

function isParentPath(): boolean {
  if (typeof window === 'undefined') return false
  const pathname = window.location.pathname
  // /parent-v2, /parent-v2/, 또는 base path 있어도 /xxx/parent-v2 형태 매칭
  const pathMatch = /\/parent-v2(?:\/|$)/.test(pathname)
  const query = new URLSearchParams(window.location.search).get('cover')
  return pathMatch || query === 'parent'
}

function formatDateTime(dateStr: string, timeStr: string): string {
  if (!dateStr || !timeStr) return '2026. 05. 16 SAT 17:00 PM'
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const weekday = WEEKDAY_EN[date.getDay()]
  const [hour, min] = timeStr.split(':')
  return `${y}. ${String(m).padStart(2, '0')}. ${String(d).padStart(2, '0')} ${weekday} ${hour}:${min} PM`
}

export function Cover() {
  const { cover, venue } = useInvitationStore()
  const { heroImageUrl } = cover
  const { date, time } = venue
  const [imageError, setImageError] = useState(false)
  const src = isParentPath() ? PARENT_COVER_IMAGE : (heroImageUrl || DEFAULT_COVER_IMAGE)
  const showImage = !imageError
  const dateTimeLine = formatDateTime(date ?? '2026-05-16', time ?? '17:00')

  return (
    <Section id="cover" className={styles.cover}>
      <div className={styles.heroWrap}>
        {showImage ? (
          <img
            src={src}
            alt="청첩장 대표"
            className={styles.heroImage}
            fetchPriority="high"
            decoding="async"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={styles.heroPlaceholder}>
            <span>메인 사진</span>
            <span className={styles.heroPlaceholderHint}>public/cover.jpeg</span>
          </div>
        )}
      </div>
      <div className={styles.content}>
        <p className={styles.namesLine}>Jaehun & Youngju</p>
        <p className={styles.dateTimeLine}>{dateTimeLine}</p>
        <p className={styles.venueLine}>LABINIUM</p>
      </div>
    </Section>
  )
}
