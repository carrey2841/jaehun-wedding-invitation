import { useMemo } from 'react'
import { Section } from '../components/Section'
import { useInvitationStore } from '../stores/invitationStore'
import styles from './CalendarSection.module.css'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

function MonthCalendar({ year, month, highlightDay }: { year: number; month: number; highlightDay: number }) {
  const { cells, monthLabel } = useMemo(() => {
    const first = new Date(year, month - 1, 1)
    const last = new Date(year, month, 0)
    const startWeekday = first.getDay()
    const daysInMonth = last.getDate()
    const prevPadding = startWeekday
    const cells: (number | null)[] = []
    for (let i = 0; i < prevPadding; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    const total = cells.length
    const remainder = total % 7
    if (remainder) for (let i = 0; i < 7 - remainder; i++) cells.push(null)
    const monthLabel = String(month)
    return { cells, monthLabel }
  }, [year, month])

  return (
    <div className={styles.calendarBox}>
      <p className={styles.calendarMonth}>{monthLabel}</p>
      <div className={styles.weekdays}>
        {WEEKDAYS.map((w) => (
          <span key={w} className={styles.weekday}>{w}</span>
        ))}
      </div>
      <div className={styles.days}>
        {cells.map((d, i) =>
          d === highlightDay ? (
            <span key={i} className={styles.dayHeartWrap}>
              <svg
                className={styles.dayHeart}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <defs>
                  <filter id="pencilStroke" x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency="0.06"
                      numOctaves="2"
                      result="noise"
                    />
                    <feDisplacementMap
                      in="SourceGraphic"
                      in2="noise"
                      scale="0.8"
                      xChannelSelector="R"
                      yChannelSelector="G"
                    />
                  </filter>
                </defs>
                <path
                  filter="url(#pencilStroke)"
                  d="M12 21.5 C 4 16 1 11 1 7 C 1 3.5 4 1 7.5 1 C 9.5 1 11 2.5 12 4 C 13 2.5 14.5 1 16.5 1 C 20 1 23 3.5 23 7 C 23 11 20 16 12 21.5 Z"
                />
              </svg>
              <span className={styles.day}>{d}</span>
            </span>
          ) : (
            <span key={i} className={styles.day}>{d ?? ''}</span>
          )
        )}
      </div>
    </div>
  )
}

export function CalendarSection() {
  const { venue } = useInvitationStore()
  const { dateTimeLabel, date } = venue

  const { year, month, day } = useMemo(() => {
    if (date) {
      const [y, m, d] = date.split('-').map(Number)
      return { year: y, month: m, day: d }
    }
    return { year: 2026, month: 5, day: 16 }
  }, [date])

  return (
    <Section id="calendar" className={styles.calendar}>
      <MonthCalendar year={year} month={month} highlightDay={day} />
      {dateTimeLabel && (
        <>
          <p className={styles.dateTime}>{dateTimeLabel}</p>
          <p className={styles.venueName}>라비니움 1층 리츄얼홀</p>
        </>
      )}
    </Section>
  )
}
