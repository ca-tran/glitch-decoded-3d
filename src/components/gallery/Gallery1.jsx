import { useMemo } from 'react'
import GalleryShell from './GalleryShell.jsx'
import { rectanglePlan } from './floorplans.js'
import { galleries } from '../../data/artworks.js'
import GalleryArtworks from '../artwork/GalleryArtworks.jsx'
import WallWashLight from './lighting/WallWashLight.jsx'
import RoomFillLight from './lighting/RoomFillLight.jsx'
import DoorwaySign from './wayfinding/DoorwaySign.jsx'

// Rectangle room, 5800 x 5100mm. White walls per the plan notes.
// Doorways: edge 3 (west) to the courtyard, edge 1 (east) to Gallery 2 —
// see floorplans.js / roomGeometry.js for the edge-index convention.
// Lighting (Phase 4): no sculptures placed yet, so both artwork walls
// (edge 0 south, edge 2 north) get a soft wash rather than individual
// spotlights, per the guide's "subtle wall wash on flat works" note.
export default function Gallery1({ position = [0, 0, 0] }) {
  const { width, depth, height } = galleries.gallery1
  const shape = useMemo(() => rectanglePlan(width, depth), [width, depth])

  return (
    <>
      <GalleryShell
        shape={shape}
        height={height}
        position={position}
        roomId="gallery1"
        floorColor="#e8e8e8"
        ceilingColor="#f2f2f2"
        wallColor="#f4f4f4"
        doors={{ 3: { width: 1.6 }, 1: { width: 1.6 } }}
      />
      <GalleryArtworks galleryId="gallery1" position={position} />
      <group position={position}>
        <WallWashLight shape={shape} edgeIndex={0} intensity={7} />
        <WallWashLight shape={shape} edgeIndex={2} intensity={7} />
        <RoomFillLight position={[width / 2, height / 2, -depth / 2]} intensity={45} distance={7} />
        <DoorwaySign shape={shape} edgeIndex={3} label="← Courtyard" />
        <DoorwaySign shape={shape} edgeIndex={1} label="Gallery 2 →" />
      </group>
    </>
  )
}
