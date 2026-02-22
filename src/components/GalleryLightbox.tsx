import { useEffect, useState, useCallback, useRef } from 'react'
import styles from './GalleryLightbox.module.css'

interface GalleryLightboxProps {
  images: string[]
  currentIndex: number
  onClose: () => void
}

const SWIPE_THRESHOLD = 50

export function GalleryLightbox({ images, currentIndex: initialIndex, onClose }: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(
    initialIndex >= 0 && initialIndex < images.length ? initialIndex : 0
  )
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const canPrev = currentIndex > 0
  const canNext = currentIndex < images.length - 1

  const goPrev = useCallback(() => {
    if (canPrev) setCurrentIndex((i) => i - 1)
  }, [canPrev])
  const goNext = useCallback(() => {
    if (canNext) setCurrentIndex((i) => i + 1)
  }, [canNext])

  useEffect(() => {
    setCurrentIndex(initialIndex >= 0 && initialIndex < images.length ? initialIndex : 0)
  }, [initialIndex, images.length])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [onClose, goPrev, goNext])

  const getTrackWidth = useCallback(() => {
    return trackRef.current?.offsetWidth ?? 0
  }, [])

  const handleStart = useCallback((clientX: number) => {
    startXRef.current = clientX
    setIsDragging(true)
    setDragOffset(0)
  }, [])

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging) return
      const width = getTrackWidth()
      if (width === 0) return
      let delta = clientX - startXRef.current
      if (currentIndex === 0 && delta > 0) delta = 0
      if (currentIndex === images.length - 1 && delta < 0) delta = 0
      setDragOffset(delta)
    },
    [isDragging, currentIndex, images.length, getTrackWidth]
  )

  const handleEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    if (dragOffset < -SWIPE_THRESHOLD && canNext) {
      setCurrentIndex((i) => i + 1)
      setDragOffset(0)
    } else if (dragOffset > SWIPE_THRESHOLD && canPrev) {
      setCurrentIndex((i) => i - 1)
      setDragOffset(0)
    } else {
      setDragOffset(0)
    }
  }, [isDragging, dragOffset, canPrev, canNext])

  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX)
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }
  const handleTouchEnd = () => {
    handleEnd()
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX)
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX)
  }
  const handleMouseUp = () => {
    handleEnd()
  }
  const handleMouseLeave = () => {
    if (isDragging) handleEnd()
  }

  useEffect(() => {
    if (!isDragging) return
    const onMouseUp = () => handleEnd()
    const onTouchEnd = () => handleEnd()
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [isDragging, handleEnd])

  if (images.length === 0) return null

  const trackWidth = trackRef.current?.offsetWidth ?? 0
  const translateX = trackWidth > 0 ? -currentIndex * trackWidth + dragOffset : -currentIndex * 100

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="갤러리 이미지"
    >
      <div
        ref={trackRef}
        className={styles.track}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={styles.strip}
          style={{
            width: `${images.length * 100}%`,
            transform:
              trackWidth > 0
                ? `translateX(${translateX}px)`
                : `translateX(-${currentIndex * (100 / images.length)}%)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          }}
        >
          {images.map((src, i) => {
            const shouldLoad = Math.abs(i - currentIndex) <= 1
            return (
              <div
                key={i}
                className={styles.slide}
                style={{ width: `${100 / images.length}%` }}
              >
                {shouldLoad ? (
                  <img
                    src={src}
                    alt=""
                    className={styles.image}
                    draggable={false}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.slidePlaceholder} aria-hidden />
                )}
              </div>
            )
          })}
        </div>
      </div>
      <button
        type="button"
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="닫기"
      >
        ×
      </button>
    </div>
  )
}
