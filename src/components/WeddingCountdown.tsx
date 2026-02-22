import { useState, useEffect, useMemo } from 'react'
import styles from './WeddingCountdown.module.css'

function getRemaining(target: Date): { days: number; hours: number; minutes: number; seconds: number } {
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
  const totalSeconds = Math.floor(diff / 1000)
  const seconds = totalSeconds % 60
  const totalMinutes = Math.floor(totalSeconds / 60)
  const minutes = totalMinutes % 60
  const totalHours = Math.floor(totalMinutes / 60)
  const hours = totalHours % 24
  const days = Math.floor(totalHours / 24)
  return { days, hours, minutes, seconds }
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function getMessage(
  target: Date,
  remaining: { days: number; hours: number; minutes: number; seconds: number }
): string {
  const { days, hours, minutes, seconds } = remaining
  const hasRemaining = days > 0 || hours > 0 || minutes > 0 || seconds > 0
  if (hasRemaining) {
    return `재훈❤영주 결혼식이 ${days}일 남았습니다`
  }
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const weddingDayStart = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime()
  if (todayStart === weddingDayStart) {
    return '재훈❤영주 결혼식 날입니다.'
  }
  if (todayStart > weddingDayStart) {
    const daysPassed = Math.floor((todayStart - weddingDayStart) / 86400000)
    return `재훈❤영주 결혼식이 ${daysPassed}일 지났습니다.`
  }
  return `재훈❤영주 결혼식이 ${days}일 남았습니다`
}

interface WeddingCountdownProps {
  date: string
  time: string
}

export function WeddingCountdown({ date, time }: WeddingCountdownProps) {
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  const targetDate = useMemo(() => {
    const [y, m, d] = date.split('-').map(Number)
    const [hour, min] = (time || '17:00').split(':').map(Number)
    return new Date(y, m - 1, d, hour ?? 17, min ?? 0, 0, 0)
  }, [date, time])

  useEffect(() => {
    setRemaining(getRemaining(targetDate))
    const id = setInterval(() => setRemaining(getRemaining(targetDate)), 1000)
    return () => clearInterval(id)
  }, [targetDate])

  const { days, hours, minutes, seconds } = remaining
  const message = getMessage(targetDate, remaining)

  return (
    <div className={styles.wrap}>
      <div className={styles.blocks}>
        <div className={styles.block}>
          <span className={styles.value}>{pad2(days)}</span>
          <span className={styles.label}>DAYS</span>
        </div>
        <div className={styles.block}>
          <span className={styles.value}>{pad2(hours)}</span>
          <span className={styles.label}>HOURS</span>
        </div>
        <div className={styles.block}>
          <span className={styles.value}>{pad2(minutes)}</span>
          <span className={styles.label}>MINUTES</span>
        </div>
        <div className={styles.block}>
          <span className={styles.value}>{pad2(seconds)}</span>
          <span className={styles.label}>SECONDS</span>
        </div>
      </div>
      <p className={styles.message}>{message}</p>
    </div>
  )
}
