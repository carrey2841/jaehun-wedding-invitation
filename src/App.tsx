import { useEffect } from 'react'
import { Cover } from './sections/Cover'
import { Invitation } from './sections/Invitation'
import { CalendarSection } from './sections/CalendarSection'
import { Gallery } from './sections/Gallery'
import { Directions } from './sections/Directions'
import { Accounts } from './sections/Accounts'
import { Guestbook } from './sections/Guestbook'
import { Share } from './sections/Share'
import { BackgroundMusic } from './components/BackgroundMusic'
import { useInvitationStore } from './stores/invitationStore'

/** 쿼리 파라미터 groomFather=이홍 이 있으면 신랑 아버지 이름을 해당 값으로 통일 (마운트 시 1회) */
function useGroomFatherFromQuery() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const groomFather = params.get('groomFather')?.trim()
    if (!groomFather) return
    const { setParents, setAccountsBySide, accountsBySide } = useInvitationStore.getState()
    setParents({ groomFather })
    const groom = accountsBySide.groom ?? []
    const next = groom.map((a) =>
      a.relation === '신랑 아버지' ? { ...a, accountHolder: groomFather } : a
    )
    setAccountsBySide({ groom: next })
  }, [])
}

function App() {
  useGroomFatherFromQuery()
  return (
    <>
      <BackgroundMusic />
      <Cover />
      <Invitation />
      <CalendarSection />
      <Gallery />
      <Directions />
      <Accounts />
      <Guestbook />
      <Share />
      <footer className="copyright">
        © 2026 Jaehun & Youngju
      </footer>
    </>
  )
}

export default App
