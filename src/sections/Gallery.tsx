import { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Section } from '../components/Section'
import { useInvitationStore } from '../stores/invitationStore'
import { GalleryLightbox } from '../components/GalleryLightbox'
import { GALLERY_IMAGE_COUNT } from '../generated/galleryCount'
import styles from './Gallery.module.css'

function getImageSrc(n: number, ext: string) {
  return `/gallery/${n}.${ext}`
}

function GalleryItem({
  index,
  ext,
  onClick,
}: {
  index: number
  ext: string
  onClick: () => void
}) {
  const [isError, setError] = useState(false)
  const src = getImageSrc(index, ext)
  const handleError = useCallback(() => setError(true), [])

  if (isError) {
    return (
      <div className={styles.placeholder} aria-hidden>
        <span>{index}</span>
      </div>
    )
  }

  return (
    <button
      type="button"
      className={styles.itemBtn}
      onClick={onClick}
      aria-label={`갤러리 ${index} 보기`}
    >
      <img
        src={src}
        alt=""
        loading="lazy"
        onError={handleError}
        className={styles.image}
      />
    </button>
  )
}

export function Gallery() {
  const { gallery } = useInvitationStore()
  const total = GALLERY_IMAGE_COUNT
  const ext = gallery.extension ?? 'jpg'

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const gridCount = 6
  const visibleList = Array.from({ length: Math.min(gridCount, total) }, (_, i) => i + 1)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  return (
    <Section id="gallery" className={styles.gallery}>
      <h2 className={styles.heading}>Gallery</h2>
      <p className={styles.hint}>사진을 터치 후, 좌우로 넘겨 주세요</p>
      <div className={styles.grid}>
        {visibleList.map((n) => (
          <GalleryItem
            key={n}
            index={n}
            ext={ext}
            onClick={() => openLightbox(n)}
          />
        ))}
      </div>
      {lightboxIndex !== null &&
        createPortal(
          <GalleryLightbox
            images={Array.from({ length: total }, (_, i) => getImageSrc(i + 1, ext))}
            currentIndex={lightboxIndex - 1}
            onClose={closeLightbox}
          />,
          document.body
        )}
    </Section>
  )
}
