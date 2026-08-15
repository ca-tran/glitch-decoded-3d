import { useMemo } from 'react'
import GalleryShell from './GalleryShell.jsx'
import { rightTrianglePlan } from './floorplans.js'
import { galleries } from '../../data/artworks.js'

// Right-triangle room, 4700 x 8660mm. Black walls — works here are lit
// primarily by their own screen glow (Phase 4), so a dark room reads correctly.
export default function Gallery2({ position = [0, 0, 0] }) {
  const { width, depth, height } = galleries.gallery2
  const shape = useMemo(() => rightTrianglePlan(width, depth), [width, depth])

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
