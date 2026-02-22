import { useEffect, useRef, useState } from 'react'
import styles from './BackgroundMusic.module.css'

const STORAGE_KEY = 'wedding-bgm'
const BGM_SRC = '/bgm.mp3'

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setPlaying] = useState(false)
  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setPlaying(false)
      localStorage.setItem(STORAGE_KEY, 'off')
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
      localStorage.setItem(STORAGE_KEY, 'on')
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'off') return
    const audio = audioRef.current
    if (!audio) return
    audio.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false))
  }, [])

  return (
    <>
      <audio ref={audioRef} src={BGM_SRC} loop preload="auto" />
      <button
        type="button"
        className={styles.btn}
        onClick={toggle}
        aria-label={isPlaying ? '배경음악 끄기' : '배경음악 켜기'}
        title={isPlaying ? '배경음악 끄기' : '배경음악 켜기'}
      >
        {isPlaying ? (
          <span className={styles.bars} aria-hidden>
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </span>
        ) : (
          <span className={styles.playIcon} aria-hidden />
        )}
      </button>
    </>
  )
}
