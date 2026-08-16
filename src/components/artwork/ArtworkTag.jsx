import { Html } from '@react-three/drei'

// Short title/artist tag that always floats near the piece — the
// "in-space" counterpart to ArtworkLabel's slide-in panel, which carries
// the full curatorial text. Anchored just above the artwork's top edge.
export default function ArtworkTag({ artwork }) {
  const [x, y, z] = artwork.position
  const tagY = y + artwork.dimensions.height / 2 + 0.16

  return (
    <Html position={[x, tagY, z]} center distanceFactor={8} occlude={false}>
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: 11,
          background: 'rgba(0,0,0,0.6)',
          color: '#eee',
          padding: '3px 8px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          transform: 'translateY(-100%)',
        }}
      >
        {artwork.title} <span style={{ opacity: 0.7 }}>— {artwork.artist}</span>
      </div>
    </Html>
  )
}
