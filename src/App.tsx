import { Cover } from './sections/Cover'
import { Invitation } from './sections/Invitation'
import { CalendarSection } from './sections/CalendarSection'
import { Gallery } from './sections/Gallery'
import { Directions } from './sections/Directions'
import { Accounts } from './sections/Accounts'
import { Share } from './sections/Share'
import { BackgroundMusic } from './components/BackgroundMusic'

function App() {
  return (
    <>
      <BackgroundMusic />
      <Cover />
      <Invitation />
      <CalendarSection />
      <Gallery />
      <Directions />
      <Accounts />
      <Share />
    </>
  )
}

export default App
