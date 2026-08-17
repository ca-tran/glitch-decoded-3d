import { lazy, Suspense } from 'react'
import ControlModeToggle from './components/ui/ControlModeToggle.jsx'
import IntroOverlay from './components/ui/IntroOverlay.jsx'
import BootScreen from './components/ui/BootScreen.jsx'
import Minimap from './components/ui/Minimap.jsx'
import ArtworkLabel from './components/artwork/ArtworkLabel.jsx'
import AudioManager from './components/audio/AudioManager.jsx'

// Section 6: "wrap the whole R3F canvas in React.lazy + Suspense" — three.js/
// r3f/drei is a large chunk; splitting it out lets the (plain-DOM) intro
// overlay paint immediately instead of waiting on it.
const GalleryScene = lazy(() => import('./components/GalleryScene.jsx'))

export default function App() {
  return (
    <>
      <Suspense fallback={<BootScreen />}>
        <GalleryScene />
      </Suspense>
      <ControlModeToggle />
      <ArtworkLabel />
      <AudioManager />
      <Minimap />
      <IntroOverlay />
    </>
  )
}
