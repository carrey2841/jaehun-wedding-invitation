import { useState, useCallback } from 'react'
import { insertGuestbook } from '../lib/guestbook'
import styles from './GuestbookFormPopup.module.css'

const AUTHOR_MAX = 10
const MESSAGE_MAX = 200

interface GuestbookFormPopupProps {
  onClose: () => void
  onSuccess: () => void
}

export function GuestbookFormPopup({ onClose, onSuccess }: GuestbookFormPopupProps) {
  const [author, setAuthor] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError('')
      const a = author.trim().slice(0, AUTHOR_MAX)
      const m = message.trim().slice(0, MESSAGE_MAX)
      if (!a) {
        setError('작성자를 입력해 주세요.')
        return
      }
      if (!m) {
        setError('메시지를 입력해 주세요.')
        return
      }
      if (!password) {
        setError('비밀번호를 입력해 주세요.')
        return
      }
      setLoading(true)
      const result = await insertGuestbook(a, password, m)
      setLoading(false)
      if (result.ok) {
        onSuccess()
        onClose()
      } else {
        setError(result.error ?? '등록에 실패했습니다.')
      }
    },
    [author, password, message, onClose, onSuccess]
  )

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="방명록 작성">
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>축하 메시지 남기기</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <label className={styles.label} htmlFor="gb-author">
              작성자
            </label>
            <input
              id="gb-author"
              type="text"
              className={styles.input}
              placeholder="10자 이내"
              maxLength={AUTHOR_MAX}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              autoComplete="username"
              disabled={loading}
            />
            <div className={styles.charCount}>{author.length}/{AUTHOR_MAX}</div>
          </div>
          <div>
            <label className={styles.label} htmlFor="gb-password">
              비밀번호
            </label>
            <input
              id="gb-password"
              type="password"
              className={styles.input}
              placeholder="삭제 시 사용"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              disabled={loading}
            />
          </div>
          <div>
            <label className={styles.label} htmlFor="gb-message">
              메시지
            </label>
            <textarea
              id="gb-message"
              className={styles.textarea}
              placeholder="200자 이내"
              maxLength={MESSAGE_MAX}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
            />
            <div className={styles.charCount}>{message.length}/{MESSAGE_MAX}</div>
          </div>
          {error && <p className={styles.formError}>{error}</p>}
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={loading}>
              취소
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? '등록 중…' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
