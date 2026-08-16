import { useMemo } from 'react'
import GalleryShell from './GalleryShell.jsx'
import { rightTrianglePlan } from './floorplans.js'
import { galleries } from '../../data/artworks.js'
import GalleryArtworks from '../artwork/GalleryArtworks.jsx'

// Right-triangle room, 4700 x 8660mm. Black walls — works here are lit
// primarily by their own screen glow (Phase 4), so a dark room reads correctly.
// Doorways: edge 2 (west) to Gallery 1, edge 1 (hypotenuse) to Gallery 3 —
// the triangular footprint has no straight "east" wall, so the doorway
// toward the next room cuts into the angled wall instead.
export default function Gallery2({ position = [0, 0, 0] }) {
  const { width, depth, height } = galleries.gallery2
  const shape = useMemo(() => rightTrianglePlan(width, depth), [width, depth])

  return (
    <>
      <GalleryShell
        shape={shape}
        height={height}
        position={position}
        roomId="gallery2"
        floorColor="#0d0d0d"
        ceilingColor="#050505"
        wallColor="#0a0a0a"
        doors={{ 2: { width: 1.6 }, 1: { width: 1.6 } }}
      />
      <GalleryArtworks galleryId="gallery2" position={position} />
    </>
  )
}
