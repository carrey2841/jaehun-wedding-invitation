import { useState } from 'react'
import { Section } from '../components/Section'
import { useInvitationStore } from '../stores/invitationStore'
import styles from './Invitation.module.css'

/** Invitation 문구 아래 사진: public 폴더에 올린 파일명으로 변경 */
const INVITATION_IMAGE = '/invitation.jpg'

export function Invitation() {
  const { invitationText, parents } = useInvitationStore()
  const { title, body, groomLine, brideLine } = invitationText
  const [imgError, setImgError] = useState(false)
  const groomParents = `${parents.groomFather ?? '이관섭'} • ${parents.groomMother ?? '이미라'}`
  const brideParents = `${parents.brideFather ?? '이승복'} • ${parents.brideMother ?? '김현주'}`

  return (
    <Section id="invitation" className={styles.invitation}>
      <div className={styles.invitationContent}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {body && (
          <p className={styles.body}>{body}</p>
        )}
        {groomLine && <p className={styles.names}>{groomLine}</p>}
        {brideLine && <p className={styles.names}>{brideLine}</p>}
      </div>
      <div className={styles.invitationImageWrap}>
        {!imgError ? (
          <img
            src={INVITATION_IMAGE}
            alt=""
            className={styles.invitationImage}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={styles.invitationImagePlaceholder}>
          </div>
        )}
      </div>
      <div className={styles.invitationContent}>
        <p className={styles.parentNames}>
          {groomParents} <span className={styles.parentNamesSpacing}>의 장남</span> 이재훈
        </p>
        <p className={styles.parentNames}>
          {brideParents} <span className={styles.parentNamesSpacing}>의 장녀</span> 이영주
        </p>
      </div>
    </Section>
  )
}
