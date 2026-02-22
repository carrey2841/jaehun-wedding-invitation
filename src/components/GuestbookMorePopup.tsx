import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchGuestbookList, PAGE_SIZE } from '../lib/guestbook'
import type { GuestbookRow } from '../lib/guestbook'
import { GuestbookDeletePopup } from './GuestbookDeletePopup'
import styles from './GuestbookMorePopup.module.css'

interface GuestbookMorePopupProps {
  onClose: () => void
  onDeleted: () => void
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return iso
  }
}

function GuestbookItem({
  item,
  onDelete,
}: {
  item: GuestbookRow
  onDelete: () => void
}) {
  return (
    <div className={styles.item}>
      <div className={styles.itemHead}>
        <span className={styles.itemAuthor}>{item.author}</span>
        <button
          type="button"
          className={styles.itemDelete}
          onClick={onDelete}
          aria-label="삭제"
        >
          ×
        </button>
      </div>
      <p className={styles.itemMessage}>{item.message}</p>
      <div className={styles.itemDate}>{formatDate(item.created_at)}</div>
    </div>
  )
}

export function GuestbookMorePopup({ onClose, onDeleted }: GuestbookMorePopupProps) {
  const [list, setList] = useState<GuestbookRow[]>([])
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<GuestbookRow | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async (off: number, append: boolean) => {
    if (append) setLoadingMore(true)
    else setLoading(true)
    const rows = await fetchGuestbookList(PAGE_SIZE, off)
    if (append) {
      setList((prev) => [...prev, ...rows])
      setLoadingMore(false)
    } else {
      setList(rows)
      setLoading(false)
    }
    setHasMore(rows.length >= PAGE_SIZE)
    setOffset(off + rows.length)
  }, [])

  useEffect(() => {
    load(0, false)
  }, [load])

  const loadMore = useCallback(() => {
    load(offset, true)
  }, [load, offset])

  const handleDeleted = useCallback(() => {
    setDeleteTarget(null)
    load(0, false)
    onDeleted()
  }, [load, onDeleted])

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="방명록 전체">
      <div className={styles.header}>
        <h2 className={styles.title}>방명록</h2>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="닫기"
        >
          ×
        </button>
      </div>
      <div className={styles.scrollArea} ref={scrollRef}>
        {loading ? (
          <div className={styles.loading}>불러오는 중…</div>
        ) : list.length === 0 ? (
          <div className={styles.empty}>아직 메시지가 없습니다.</div>
        ) : (
          <>
            <div className={styles.list}>
              {list.map((item) => (
                <GuestbookItem
                  key={item.id}
                  item={item}
                  onDelete={() => setDeleteTarget(item)}
                />
              ))}
            </div>
            {hasMore && (
              <button
                type="button"
                className={styles.loadMore}
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? '불러오는 중…' : '더 불러오기'}
              </button>
            )}
          </>
        )}
      </div>
      {deleteTarget && (
        <GuestbookDeletePopup
          item={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  )
}
