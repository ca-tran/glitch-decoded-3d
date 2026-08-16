import { useMemo } from 'react'
import GalleryShell from './GalleryShell.jsx'
import { roundedRightTrianglePlan } from './floorplans.js'
import { artworks, galleries } from '../../data/artworks.js'
import GalleryArtworks from '../artwork/GalleryArtworks.jsx'
import ProjectionLight from './lighting/ProjectionLight.jsx'
import RoomFillLight from './lighting/RoomFillLight.jsx'

// Right-triangle room with a rounded corner, 8410 x 5400mm (hyp ~8460mm).
// Per the plan notes: white intro wall (edge 0), black elsewhere — dim
// ambient with a single strong projection-style light source (Phase 4).
// Doorways: edge 2 (west) to Gallery 2, edge 1 (hypotenuse) to Gallery 4.
// Lighting (Phase 4): the projection light is sourced from g3-04 (the
// piece flagged in data/artworks.js as likely the Rosa Menkman video work),
// throwing its beam across the room — "could double as the actual light
// source in-scene," per the guide. Everything else gets only a dim fill.
const PROJECTION_SOURCE_ID = 'g3-04'

export default function Gallery3({ position = [0, 0, 0] }) {
  const { width, depth, height } = galleries.gallery3
  const shape = useMemo(() => roundedRightTrianglePlan(width, depth), [width, depth])
  const source = artworks.find((a) => a.id === PROJECTION_SOURCE_ID)

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
      <group position={position}>
        {source && (
          <ProjectionLight
            origin={source.position}
            facingAngleY={source.rotation[1]}
            throwDistance={6.5}
          />
        )}
        <RoomFillLight position={[width / 2, height / 2, -depth / 2]} intensity={16} distance={7} />
      </group>
    </>
  )
}
