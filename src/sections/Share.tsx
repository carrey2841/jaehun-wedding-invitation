import { useState, useCallback } from 'react'
import { Section } from '../components/Section'
import styles from './Share.module.css'

export function Share() {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }, [url])

  const shareKakao = useCallback(() => {
    if (typeof window === 'undefined' || !(window as unknown as { Kakao?: { Share?: { sendDefault: (o: unknown) => void } } }).Kakao) {
      window.open(
        `https://story.kakao.com/share?url=${encodeURIComponent(url)}`,
        '_blank',
        'noopener,noreferrer'
      )
      return
    }
    const Kakao = (window as unknown as { Kakao: { Share: { sendDefault: (o: unknown) => void } } }).Kakao
    Kakao.Share.sendDefault({
      objectType: 'text',
      text: '청첩장을 확인해 주세요.',
      link: {
        mobileWebUrl: url,
        webUrl: url,
      },
    })
  }, [url])

  return (
    <Section id="share" className={styles.share}>
      <h2 className={styles.heading}>청첩장 공유</h2>
      <div className={styles.buttons}>
        <button
          type="button"
          className={styles.kakaoBtn}
          onClick={shareKakao}
        >
          <span className={styles.kakaoIcon}>K</span>
          카카오톡으로 전달하기
        </button>
        <button
          type="button"
          className={styles.copyLinkBtn}
          onClick={copyLink}
        >
          {copied ? '복사되었습니다' : '청첩장 링크 복사하기'}
        </button>
      </div>
    </Section>
  )
}
