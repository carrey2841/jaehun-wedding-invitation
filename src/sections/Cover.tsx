import { useState } from 'react'
import { Section } from '../components/Section'
import { useInvitationStore } from '../stores/invitationStore'
import styles from './Cover.module.css'

/** 메인 사진 기본 경로: public/cover.jpeg 에 넣으면 자동 표시 */
const DEFAULT_COVER_IMAGE = '/cover.jpeg'

const WEEKDAY_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

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
  const src = heroImageUrl || DEFAULT_COVER_IMAGE
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
