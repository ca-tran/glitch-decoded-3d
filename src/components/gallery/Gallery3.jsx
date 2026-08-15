import { useMemo } from 'react'
import GalleryShell from './GalleryShell.jsx'
import { roundedRightTrianglePlan } from './floorplans.js'
import { galleries } from '../../data/artworks.js'

// Right-triangle room with a rounded corner, 8410 x 5400mm (hyp ~8460mm).
// Per the plan notes: white intro wall, black elsewhere — dim ambient with
// a single strong projection-style light source (Phase 4).
export default function Gallery3({ position = [0, 0, 0] }) {
  const { width, depth, height } = galleries.gallery3
  const shape = useMemo(() => roundedRightTrianglePlan(width, depth), [width, depth])

  return (
    <GalleryShell
      shape={shape}
      height={height}
      position={position}
      floorColor="#0a0a0a"
      ceilingColor="#050505"
      wallColor="#0a0a0a"
      // Edge 0 is the entry wall (the leg running along the width) — painted
      // white as the "intro wall", matching Gallery 1's palette.
      wallColorOverrides={{ 0: '#f4f4f4' }}
    />
  )
}
