import { useState, useCallback } from 'react'
import { softDeleteGuestbook } from '../lib/guestbook'
import type { GuestbookRow } from '../lib/guestbook'
import styles from './GuestbookDeletePopup.module.css'

interface GuestbookDeletePopupProps {
  item: GuestbookRow
  onClose: () => void
  onDeleted: () => void
}

export function GuestbookDeletePopup({ item, onClose, onDeleted }: GuestbookDeletePopupProps) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = useCallback(async () => {
    if (!password.trim()) {
      setError('비밀번호를 입력해 주세요.')
      return
    }
    setError('')
    setLoading(true)
    const result = await softDeleteGuestbook(item.id, password)
    setLoading(false)
    if (result.ok) {
      onDeleted()
      onClose()
    } else {
      setError(result.error ?? '삭제에 실패했습니다.')
    }
  }, [item.id, password, onClose, onDeleted])

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="방명록 삭제">
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>메시지를 삭제할까요?</h3>
        <label className={styles.label} htmlFor="gb-delete-pw">
          비밀번호
        </label>
        <input
          id="gb-delete-pw"
          type="password"
          className={styles.input}
          placeholder="작성 시 입력한 비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleDelete()}
          disabled={loading}
          autoFocus
        />
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={loading}>
            취소
          </button>
          <button type="button" className={styles.deleteBtn} onClick={handleDelete} disabled={loading}>
            {loading ? '삭제 중…' : '삭제'}
          </button>
        </div>
      </div>
    </div>
  )
}
