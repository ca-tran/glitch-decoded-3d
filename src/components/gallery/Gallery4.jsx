import { useMemo } from 'react'
import GalleryShell from './GalleryShell.jsx'
import { lShapePlan } from './floorplans.js'
import { galleries } from '../../data/artworks.js'

// L-shape room, 3680 x 4700mm. Black walls, spotlit sculptures + wall-washed
// flat works (Phase 4), matching Gallery 1's lighting approach.
export default function Gallery4({ position = [0, 0, 0] }) {
  const { width, depth, height } = galleries.gallery4
  const shape = useMemo(() => lShapePlan(width, depth), [width, depth])

  return (
    <GalleryShell
      shape={shape}
      height={height}
      position={position}
      floorColor="#0d0d0d"
      ceilingColor="#050505"
      wallColor="#0a0a0a"
    />
  )
}
