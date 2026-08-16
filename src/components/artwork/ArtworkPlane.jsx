import { useTexture } from '@react-three/drei'
import { useGalleryStore } from '../../store/useGalleryStore.js'
import { assetPath } from '../../utils/assetPath.js'

/**
 * One artwork mounted on a wall: a PlaneGeometry sized to the work's real
 * `dimensions`, textured with `mediaSrc`. Video works get a static texture
 * for now too (placeholder art carries its own "▶ video" badge, per
 * Section 9) — swapping in a real <video>/VideoTexture pipeline is a later,
 * data-only change once footage is supplied.
 *
 * Click/tap opens ArtworkLabel via the shared focusedArtworkId store.
 */
export default function ArtworkPlane({ artwork }) {
  const texture = useTexture(assetPath(artwork.mediaSrc))
  const focusedArtworkId = useGalleryStore((s) => s.focusedArtworkId)
  const setFocusedArtworkId = useGalleryStore((s) => s.setFocusedArtworkId)
  const isFocused = focusedArtworkId === artwork.id

  const { width, height } = artwork.dimensions

  return (
    <mesh
      position={artwork.position}
      rotation={artwork.rotation}
      userData={{ isArtwork: true }}
      onClick={(e) => {
        e.stopPropagation()
        setFocusedArtworkId(isFocused ? null : artwork.id)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.85}
        metalness={0}
        emissive={isFocused ? '#333333' : '#000000'}
      />
    </mesh>
  )
}
