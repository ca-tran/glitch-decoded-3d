import { artworks } from '../../data/artworks.js'
import { useGalleryStore } from '../../store/useGalleryStore.js'

// Slide-in side panel with the full curatorial text — reserved for
// readability of longer paragraphs, while ArtworkTag handles the always-on
// in-space title/artist tag. Rendered outside the Canvas as plain DOM.
export default function ArtworkLabel() {
  const focusedArtworkId = useGalleryStore((s) => s.focusedArtworkId)
  const setFocusedArtworkId = useGalleryStore((s) => s.setFocusedArtworkId)
  const artwork = artworks.find((a) => a.id === focusedArtworkId)
  const open = Boolean(artwork)

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100%',
        width: 'min(360px, 100%)',
        background: 'rgba(10,10,10,0.94)',
        color: '#eee',
        fontFamily: 'monospace',
        borderLeft: '1px solid #333',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 200ms ease',
        zIndex: 20,
        padding: '28px 24px',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      {artwork && (
        <>
          <button
            type="button"
            onClick={() => setFocusedArtworkId(null)}
            style={{
              background: 'none',
              border: '1px solid #444',
              color: '#eee',
              fontFamily: 'inherit',
              fontSize: 12,
              padding: '4px 10px',
              cursor: 'pointer',
              marginBottom: 20,
            }}
          >
            Close ✕
          </button>

          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 4 }}>{artwork.artist}</div>
          <h2 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 500 }}>{artwork.title}</h2>
          <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 18 }}>
            {artwork.year} · {artwork.medium}
            <br />
            {artwork.dimensions.width}m × {artwork.dimensions.height}m
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.9 }}>{artwork.labelText}</p>
        </>
      )}
    </div>
  )
}
