import type { ContactForAction } from '../types/invitation'
import styles from './ContactPopup.module.css'

interface ContactPopupProps {
  contact: ContactForAction
  onClose: () => void
}

function ActionButton({
  label,
  tel,
  sms,
}: {
  label: string
  tel?: string
  sms?: string
}) {
  if (!tel && !sms) return null
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <div className={styles.buttons}>
        {tel && (
          <a href={`tel:${tel}`} className={styles.btn}>
            전화
          </a>
        )}
        {sms && (
          <a href={`sms:${sms}`} className={styles.btn}>
            문자
          </a>
        )}
      </div>
    </div>
  )
}

export function ContactPopup({ contact, onClose }: ContactPopupProps) {
  const { hostPhone, groomPhone, bridePhone } = contact

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>연락하기</h3>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="닫기"
          >
            ×
          </button>
        </div>
        <div className={styles.body}>
          {hostPhone && (
            <ActionButton label="혼주" tel={hostPhone} sms={hostPhone} />
          )}
          <ActionButton label="신랑에게" tel={groomPhone} sms={groomPhone} />
          <ActionButton label="신부에게" tel={bridePhone} sms={bridePhone} />
          {!hostPhone && !groomPhone && !bridePhone && (
            <p className={styles.placeholder}>연락처를 등록해 주세요.</p>
          )}
        </div>
      </div>
    </div>
  )
}
