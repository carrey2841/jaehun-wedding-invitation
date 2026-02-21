import {useState, useCallback} from 'react'
import {Section} from '../components/Section'
import {useInvitationStore} from '../stores/invitationStore'
import styles from './Directions.module.css'

const VENUE_ADDRESS_LINE1 = '서울특별시 송파구 천호대로 996'
const VENUE_ADDRESS_LINE2 = '라비니움 1층 리츄얼홀'
const VENUE_NAME = '라비니움'

function CopyIcon() {
    return (
        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
    )
}

function getNaverMapUrl() {
    return `https://map.naver.com/v5/search/${encodeURIComponent(VENUE_NAME)}`
}

export function Directions() {
    const {venue} = useInvitationStore()
    const {subway, car, parking} = venue
    const [copied, setCopied] = useState(false)

    const copyAddress = useCallback(async () => {
        const text = `${VENUE_ADDRESS_LINE1}`
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // fallback: legacy
            const ta = document.createElement('textarea')
            ta.value = text
            ta.style.position = 'fixed'
            document.body.appendChild(ta)
            ta.select()
            document.execCommand('copy')
            document.body.removeChild(ta)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }, [])

    return (
        <Section id="directions" className={styles.directions}>
            <h2 className={styles.heading}>Location</h2>
            <a
                href={getNaverMapUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapWrap}
                aria-label="네이버 지도에서 예식장 위치 보기"
            >
                <img
                    src="/labinium-map.jpg"
                    alt="라비니움 오시는 길 지도"
                    className={styles.mapImage}
                />
            </a>
            <p className={styles.mapHint}>약도 클릭 시 네이버 지도로 이동</p>
            <div className={styles.addressWrap}>
                <p className={styles.address}>
                    {VENUE_ADDRESS_LINE1}
                    <br/>
                    {VENUE_ADDRESS_LINE2}
                </p>
                <button
                    type="button"
                    className={styles.copyBtn}
                    onClick={copyAddress}
                    aria-label="주소 복사"
                    title="주소 복사"
                >
                    <CopyIcon/>
                    {copied && <span className={styles.copiedLabel}>복사됨</span>}
                </button>
            </div>

            <div className={styles.transport}>
                <h3 className={styles.subHeading}>지하철</h3>
                {subway ? (<p className={styles.transportText}>{subway}</p>) : ""}
                <h3 className={styles.subHeading}>자가용</h3>
                {car ? (<p className={styles.transportText}>{car}</p>) : ""}
                <h3 className={styles.subHeading}>주차</h3>
                {parking ? (<p className={styles.transportText}>{parking}</p>) : ""}
            </div>
        </Section>
    )
}
