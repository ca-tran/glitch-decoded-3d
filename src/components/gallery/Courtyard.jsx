import { useMemo } from 'react'
import GalleryShell from './GalleryShell.jsx'
import { rectanglePlan } from './floorplans.js'
import { galleries } from '../../data/artworks.js'
import RoomFillLight from './lighting/RoomFillLight.jsx'
import DoorwaySign from './wayfinding/DoorwaySign.jsx'

// Open-air courtyard — no ceiling, low perimeter walls, ambient sky light
// rather than gallery spotlighting. Footprint is a placeholder pending real
// floorplan dimensions (see data/artworks.js). Doorway: edge 1 (east) to
// Gallery 1 — this is the entry point of the walkthrough.
// Lighting (Phase 4): hemisphereLight has no distance falloff — a naive
// use would leak sky light evenly into every gallery down the hall,
// undermining Gallery 2/3's deliberately dim moods. Kept, but dialed way
// down; a bounded RoomFillLight does the actual work of making the
// courtyard itself read as bright open-air space.
export default function Courtyard({ position = [0, 0, 0] }) {
  const { width, depth, height } = galleries.courtyard
  const shape = useMemo(() => rectanglePlan(width, depth), [width, depth])

  return (
    <>
      <GalleryShell
        shape={shape}
        height={height}
        position={position}
        roomId="courtyard"
        floorColor="#2a2a2a"
        wallColor="#1c1c1c"
        ceiling={false}
        doors={{ 1: { width: 2.0 } }}
      />
      <hemisphereLight args={['#8fa6c4', '#1c1c1c', 0.08]} />
      <group position={position}>
        <RoomFillLight position={[width / 2, height * 0.9, -depth / 2]} intensity={80} distance={9} color="#dce8ff" />
        <DoorwaySign shape={shape} edgeIndex={1} label="Gallery 1 →" />
      </group>
    </>
  )
}
