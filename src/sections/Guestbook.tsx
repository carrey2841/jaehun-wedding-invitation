import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Section } from '../components/Section'
import { fetchGuestbookList, formatGuestbookDateKST } from '../lib/guestbook'
import type { GuestbookRow } from '../lib/guestbook'
import { GuestbookFormPopup } from '../components/GuestbookFormPopup'
import { GuestbookMorePopup } from '../components/GuestbookMorePopup'
import { GuestbookDeletePopup } from '../components/GuestbookDeletePopup'
import styles from './Guestbook.module.css'

const PREVIEW_COUNT = 5

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
      <div className={styles.itemDate}>{formatGuestbookDateKST(item.created_at)}</div>
    </div>
  )
}

export function Guestbook() {
  const [list, setList] = useState<GuestbookRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<GuestbookRow | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    const rows = await fetchGuestbookList(PREVIEW_COUNT, 0)
    setList(rows)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const hasMore = list.length >= PREVIEW_COUNT

  const handleFormSuccess = useCallback(() => {
    refresh()
  }, [refresh])

  const handleDeleted = useCallback(() => {
    setDeleteTarget(null)
    refresh()
  }, [refresh])

  return (
    <Section id="guestbook" className={styles.guestbook}>
      <h2 className={styles.heading}>방명록</h2>
      <p className={styles.hint}>축하 메시지를 남겨 주세요</p>

      <button
        type="button"
        className={styles.writeBtn}
        onClick={() => setShowForm(true)}
      >
        축하 메시지 남기기
      </button>

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
              className={styles.moreBtn}
              onClick={() => setShowMore(true)}
            >
              + 더보기
            </button>
          )}
        </>
      )}

      {showForm &&
        createPortal(
          <GuestbookFormPopup
            onClose={() => setShowForm(false)}
            onSuccess={handleFormSuccess}
          />,
          document.body
        )}

      {showMore &&
        createPortal(
          <GuestbookMorePopup
            onClose={() => setShowMore(false)}
            onDeleted={handleFormSuccess}
          />,
          document.body
        )}

      {deleteTarget &&
        createPortal(
          <GuestbookDeletePopup
            item={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onDeleted={handleDeleted}
          />,
          document.body
        )}
    </Section>
  )
}
