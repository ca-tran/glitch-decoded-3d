import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Courtyard from './components/gallery/Courtyard.jsx'
import Gallery1 from './components/gallery/Gallery1.jsx'
import Gallery2 from './components/gallery/Gallery2.jsx'
import Gallery3 from './components/gallery/Gallery3.jsx'
import Gallery4 from './components/gallery/Gallery4.jsx'
import { galleries } from './data/artworks.js'

// Phase 1 checkpoint: fly through empty, correctly-proportioned rooms
// before any artwork is added. Rooms are laid out in a row with gaps (real
// doorway/corridor adjacency comes in Phase 2) and OrbitControls stands in
// for real player controls (FirstPersonControls / PointNavControls, also
// Phase 2) purely so the geometry can be inspected now.
const GAP = 4
const layout = (() => {
  const order = ['courtyard', 'gallery1', 'gallery2', 'gallery3', 'gallery4']
  let x = 0
  const positions = {}
  for (const key of order) {
    positions[key] = [x, 0, 0]
    x += galleries[key].width + GAP
  }
  return positions
})()

export default function App() {
  return (
    <Suspense fallback={null}>
      <Canvas
        shadows
        camera={{ position: [10, 12, 22], fov: 55, near: 0.1, far: 200 }}
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

        <OrbitControls target={[10, 1.6, 2]} makeDefault />
      </Canvas>
    </Suspense>
  )
}
