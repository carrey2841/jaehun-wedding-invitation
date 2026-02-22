import { useState, useCallback, useEffect, useRef } from 'react'
import { Section } from '../components/Section'
import styles from './Share.module.css'

const KAKAO_SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js'

type KakaoSharePayload =
  | { objectType: 'text'; text: string; link: { mobileWebUrl: string; webUrl: string } }
  | {
      objectType: 'feed'
      content: { title: string; description: string; imageUrl: string; link: { mobileWebUrl: string; webUrl: string } }
      buttonTitle?: string
      buttons?: Array<{ title: string; link: { mobileWebUrl: string; webUrl: string } }>
    }

declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void
      isInitialized: () => boolean
      Share?: { sendDefault: (o: KakaoSharePayload) => void }
    }
  }
}

export function Share() {
  const [copied, setCopied] = useState(false)
  const [sdkReady, setSdkReady] = useState(false)
  const loadingRef = useRef(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const kakaoKey =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_KAKAO_JAVASCRIPT_KEY
      ? String(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY).trim()
      : ''

  useEffect(() => {
    if (!kakaoKey || loadingRef.current) return
    if (window.Kakao?.isInitialized?.()) {
      setSdkReady(true)
      return
    }
    if (document.querySelector(`script[src="${KAKAO_SDK_URL}"]`)) {
      if (window.Kakao) {
        window.Kakao.init(kakaoKey)
        setSdkReady(true)
      }
      return
    }
    loadingRef.current = true
    const script = document.createElement('script')
    script.src = KAKAO_SDK_URL
    script.crossOrigin = 'anonymous'
    script.async = true
    script.onload = () => {
      if (window.Kakao && kakaoKey) {
        window.Kakao.init(kakaoKey)
        setSdkReady(true)
      }
      loadingRef.current = false
    }
    script.onerror = () => {
      loadingRef.current = false
    }
    document.head.appendChild(script)
  }, [kakaoKey])

  const shareKakao = useCallback(async () => {
    const title = '재훈❤️영주 결혼합니다.'
    const description = '드디어 저희 결혼합니다❤️\n2026년 5월 16일, 함께 축하해주세요!'
    const siteOrigin =
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL
        ? String(import.meta.env.VITE_SITE_URL).replace(/\/$/, '')
        : null) ?? (typeof window !== 'undefined' ? window.location.origin : '')
    const coverImageUrl = `${siteOrigin}/cover.jpeg`

    if (sdkReady && window.Kakao?.Share) {
      try {
        const link = { mobileWebUrl: url, webUrl: url }
        window.Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title,
            description,
            imageUrl: coverImageUrl,
            link,
          },
          buttons: [{ title: '모바일 청첩장 보기', link }],
        })
        return
      } catch {
        // fallback
      }
    }

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: '청첩장', text: title, url })
        return
      } catch (e) {
        if ((e as Error).name === 'AbortError') return
      }
    }

    try {
      await navigator.clipboard.writeText(`${title}\n${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }, [url, sdkReady])

  return (
    <Section id="share" className={styles.share}>
      <h2 className={styles.heading}>카카오톡으로 공유하기</h2>
      <p className={styles.hint}>청첩장 링크를 카카오톡으로 보내보세요.</p>
      <button type="button" className={styles.shareBtn} onClick={shareKakao}>
        {copied ? '링크가 복사되었어요' : '카카오톡으로 공유하기'}
      </button>
    </Section>
  )
}
