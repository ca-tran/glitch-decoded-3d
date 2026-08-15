import { useMemo } from 'react'
import GalleryShell from './GalleryShell.jsx'
import { rectanglePlan } from './floorplans.js'
import { galleries } from '../../data/artworks.js'

// Open-air courtyard — no ceiling, low perimeter walls, ambient sky light
// rather than gallery spotlighting. Footprint is a placeholder pending real
// floorplan dimensions (see data/artworks.js).
export default function Courtyard({ position = [0, 0, 0] }) {
  const { width, depth, height } = galleries.courtyard
  const shape = useMemo(() => rectanglePlan(width, depth), [width, depth])

  return (
    <>
      <GalleryShell
        shape={shape}
        height={height}
        position={position}
        floorColor="#2a2a2a"
        wallColor="#1c1c1c"
        ceiling={false}
      />
      <hemisphereLight args={['#8fa6c4', '#1c1c1c', 0.6]} position={position} />
    </>
  )
}
