import { useMemo } from 'react'
import GalleryShell from './GalleryShell.jsx'
import { lShapePlan } from './floorplans.js'
import { galleries } from '../../data/artworks.js'
import GalleryArtworks from '../artwork/GalleryArtworks.jsx'
import WallWashLight from './lighting/WallWashLight.jsx'
import RoomFillLight from './lighting/RoomFillLight.jsx'
import DoorwaySign from './wayfinding/DoorwaySign.jsx'

// L-shape room, 3680 x 4700mm. Black walls, spotlit sculptures + wall-washed
// flat works (Phase 4), matching Gallery 1's lighting approach.
// Doorway: edge 5 (west) to Gallery 3 — last room in the walkthrough.
// Lighting (Phase 4): a wash per occupied wall (edges 0, 1, 3, 4 — see
// data/artworks.js for which works sit on which), no sculptures yet.
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
      <group position={position}>
        <WallWashLight shape={shape} edgeIndex={0} intensity={5} width={2.4} />
        <WallWashLight shape={shape} edgeIndex={1} intensity={5} width={1.8} />
        <WallWashLight shape={shape} edgeIndex={3} intensity={5} width={1.8} />
        <WallWashLight shape={shape} edgeIndex={4} intensity={5} width={1.8} />
        <RoomFillLight position={[width / 2, height / 2, -depth / 2]} intensity={24} distance={5} />
        <DoorwaySign shape={shape} edgeIndex={5} label="← Gallery 3" height={2.4} />
      </group>
    </>
  )
}
