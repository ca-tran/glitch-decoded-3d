import { Suspense } from 'react'
import ArtworkPlane from './ArtworkPlane.jsx'
import ArtworkTag from './ArtworkTag.jsx'
import { artworks } from '../../data/artworks.js'

// Renders every artwork belonging to one gallery, as a sibling group at the
// same world `position` GalleryShell uses — so each artwork's stored
// position/rotation stays local to its room, matching the guide's data
// convention ("position within the room").
export default function GalleryArtworks({ galleryId, position = [0, 0, 0] }) {
  const items = artworks.filter((a) => a.gallery === galleryId)

  return (
    <group position={position}>
      <Suspense fallback={null}>
        {items.map((artwork) => (
          <group key={artwork.id}>
            <ArtworkPlane artwork={artwork} />
            <ArtworkTag artwork={artwork} />
          </group>
        ))}
      </Suspense>
    </group>
  )
}
