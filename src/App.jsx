import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import Courtyard from './components/gallery/Courtyard.jsx'
import Gallery1 from './components/gallery/Gallery1.jsx'
import Gallery2 from './components/gallery/Gallery2.jsx'
import Gallery3 from './components/gallery/Gallery3.jsx'
import Gallery4 from './components/gallery/Gallery4.jsx'
import FirstPersonControls from './components/player/FirstPersonControls.jsx'
import PointNavControls from './components/player/PointNavControls.jsx'
import ControlModeToggle from './components/ui/ControlModeToggle.jsx'
import IntroOverlay from './components/ui/IntroOverlay.jsx'
import ArtworkLabel from './components/artwork/ArtworkLabel.jsx'
import AudioManager from './components/audio/AudioManager.jsx'
import { galleries } from './data/artworks.js'
import { useGalleryStore } from './store/useGalleryStore.js'
import { isDesktopDevice } from './utils/device.js'

const GAP = 4
const ROOM_ORDER = ['courtyard', 'gallery1', 'gallery2', 'gallery3', 'gallery4']

// Row layout, placeholder pending real floorplan adjacency. Each room's z is
// offset by half its own depth so every room's centered doorway lands on a
// shared z=0 "spine" — see the door-edge comments in each Gallery*.jsx and
// roomGeometry.js for how doorway cutouts are computed.
function useLayout() {
  return useMemo(() => {
    let x = 0
    const positions = {}
    for (const key of ROOM_ORDER) {
      const { width, depth } = galleries[key]
      positions[key] = [x, 0, depth / 2]
      x += width + GAP
    }
    return positions
  }, [])
}

export default function App() {
  const layout = useLayout()
  const controlMode = useGalleryStore((s) => s.controlMode)
  // Safety net: FPS mode never activates on touch/coarse-pointer devices
  // even if store state somehow ends up 'fps' there.
  const useFps = controlMode === 'fps' && isDesktopDevice()

  return (
    <>
      <Suspense fallback={null}>
        <Canvas
          shadows
          camera={{ position: [3, 1.6, 0], rotation: [0, -Math.PI / 2, 0], fov: 70, near: 0.1, far: 200 }}
          style={{ background: '#000' }}
        >
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={0.55} />
          <directionalLight position={[15, 20, 10]} intensity={0.9} castShadow={false} />

          <Courtyard position={layout.courtyard} />
          <Gallery1 position={layout.gallery1} />
          <Gallery2 position={layout.gallery2} />
          <Gallery3 position={layout.gallery3} />
          <Gallery4 position={layout.gallery4} />

          {useFps ? <FirstPersonControls /> : <PointNavControls />}
        </Canvas>
      </Suspense>
      <ControlModeToggle />
      <ArtworkLabel />
      <AudioManager />
      <IntroOverlay />
    </>
  )
}
