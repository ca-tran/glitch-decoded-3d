import { useMemo } from 'react'
import GalleryShell from './GalleryShell.jsx'
import { roundedRightTrianglePlan } from './floorplans.js'
import { galleries } from '../../data/artworks.js'
import GalleryArtworks from '../artwork/GalleryArtworks.jsx'

// Right-triangle room with a rounded corner, 8410 x 5400mm (hyp ~8460mm).
// Per the plan notes: white intro wall (edge 0), black elsewhere — dim
// ambient with a single strong projection-style light source (Phase 4).
// Doorways: edge 2 (west) to Gallery 2, edge 1 (hypotenuse) to Gallery 4.
export default function Gallery3({ position = [0, 0, 0] }) {
  const { width, depth, height } = galleries.gallery3
  const shape = useMemo(() => roundedRightTrianglePlan(width, depth), [width, depth])

  return (
    <>
      <GalleryShell
        shape={shape}
        height={height}
        position={position}
        roomId="gallery3"
        floorColor="#0a0a0a"
        ceilingColor="#050505"
        wallColor="#0a0a0a"
        wallColorOverrides={{ 0: '#f4f4f4' }}
        doors={{ 2: { width: 1.6 }, 1: { width: 1.6 } }}
      />
      <GalleryArtworks galleryId="gallery3" position={position} />
    </>
  )
}
