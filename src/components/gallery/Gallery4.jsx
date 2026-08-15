import { useMemo } from 'react'
import GalleryShell from './GalleryShell.jsx'
import { lShapePlan } from './floorplans.js'
import { galleries } from '../../data/artworks.js'
import GalleryArtworks from '../artwork/GalleryArtworks.jsx'

// L-shape room, 3680 x 4700mm. Black walls, spotlit sculptures + wall-washed
// flat works (Phase 4), matching Gallery 1's lighting approach.
// Doorway: edge 5 (west) to Gallery 3 — last room in the walkthrough.
export default function Gallery4({ position = [0, 0, 0] }) {
  const { width, depth, height } = galleries.gallery4
  const shape = useMemo(() => lShapePlan(width, depth), [width, depth])

  return (
    <>
      <GalleryShell
        shape={shape}
        height={height}
        position={position}
        roomId="gallery4"
        floorColor="#0d0d0d"
        ceilingColor="#050505"
        wallColor="#0a0a0a"
        doors={{ 5: { width: 1.6 } }}
      />
      <GalleryArtworks galleryId="gallery4" position={position} />
    </>
  )
}
