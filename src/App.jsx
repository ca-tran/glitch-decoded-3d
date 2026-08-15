import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

// Scaffold sanity check (Section 2 of the build guide) — confirms Vite +
// React + R3F + drei are wired up correctly. Replaced by the real gallery
// scene in Phase 1.
export default function App() {
  return (
    <Suspense fallback={null}>
      <Canvas camera={{ position: [3, 2, 5], fov: 55 }}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#e5e4e7" />
        </mesh>
        <OrbitControls />
      </Canvas>
    </Suspense>
  )
}
