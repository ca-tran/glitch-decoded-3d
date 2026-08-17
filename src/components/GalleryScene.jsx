import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import Courtyard from './gallery/Courtyard.jsx'
import Gallery1 from './gallery/Gallery1.jsx'
import Gallery2 from './gallery/Gallery2.jsx'
import Gallery3 from './gallery/Gallery3.jsx'
import Gallery4 from './gallery/Gallery4.jsx'
import FirstPersonControls from './player/FirstPersonControls.jsx'
import PointNavControls from './player/PointNavControls.jsx'
import PlayerTracker from './player/PlayerTracker.jsx'
import LoadingScreen from './ui/LoadingScreen.jsx'
import { useGalleryStore } from '../store/useGalleryStore.js'
import { isDesktopDevice } from '../utils/device.js'
import { isLowPowerDevice } from '../utils/devicePerformance.js'
import { computeRoomLayout } from '../utils/roomLayout.js'
import { resolveVisibleRooms } from '../utils/currentRoom.js'

// Required once before any <rectAreaLight> renders (used for Gallery 1/4's
// wall-wash fixtures) — without it RectAreaLight silently renders black.
RectAreaLightUniformsLib.init()

const ROOM_COMPONENTS = { courtyard: Courtyard, gallery1: Gallery1, gallery2: Gallery2, gallery3: Gallery3, gallery4: Gallery4 }

// The actual R3F canvas, split into its own module and lazy-loaded from
// App.jsx (Section 6: "wrap the whole R3F canvas in React.lazy + Suspense")
// — the intro overlay is plain DOM and can paint before the three.js/r3f/
// drei bundle (a genuinely large chunk) even finishes downloading.
//
// Wraps its own Canvas in a second, inner Suspense (fallback: the real
// drei-`useProgress`-backed LoadingScreen) for asset loading — separate
// from App.jsx's outer Suspense around the lazy import itself. Asset
// loading can only start once this module's code has already loaded, so
// by the time this boundary matters, using drei here costs nothing extra.
export default function GalleryScene() {
  const layout = useMemo(() => computeRoomLayout(), [])
  const controlMode = useGalleryStore((s) => s.controlMode)
  const playerX = useGalleryStore((s) => s.playerPosition[0])
  const lowPower = useMemo(() => isLowPowerDevice(), [])
  // Safety net: FPS mode never activates on touch/coarse-pointer devices
  // even if store state somehow ends up 'fps' there.
  const useFps = controlMode === 'fps' && isDesktopDevice()

  // "Unmount off-screen galleries entirely" (Section 6) — the current room
  // plus its immediate neighbors stay mounted, everything further away
  // doesn't render (or hold collision segments, lights, artwork textures…)
  // at all.
  const { visible } = useMemo(() => resolveVisibleRooms(playerX), [playerX])

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Canvas
        shadows={!lowPower}
        camera={{ position: [3, 1.6, 0], rotation: [0, -Math.PI / 2, 0], fov: 70, near: 0.1, far: 200 }}
        style={{ background: '#000' }}
      >
        <color attach="background" args={['#000000']} />
        {/* Very low global fill only — real light now comes from each
            gallery's own fixtures (Phase 4). Keeps doorway gaps and the
            gaps between rooms from going pure black without flattening
            each room's mood. */}
        <ambientLight intensity={0.05} />

        {Object.entries(ROOM_COMPONENTS).map(([key, Room]) =>
          visible.has(key) ? <Room key={key} position={layout[key]} /> : null,
        )}

        {useFps ? <FirstPersonControls /> : <PointNavControls />}
        <PlayerTracker />
      </Canvas>
    </Suspense>
  )
}
