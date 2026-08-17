import { useGalleryStore } from '../../store/useGalleryStore.js'
import { startAmbient } from '../../audio/audioEngine.js'

// Title card + "click to enter" gate. AudioContext creation must happen
// synchronously inside a real user gesture (browsers block autoplay with
// sound), which this component exists to satisfy — see Phase 5.
//
// The wordmark is a CSS glitch-text effect (layered red/cyan channel
// offset) rather than the real logo — Section 9's placeholder strategy:
// on-brand in spirit (this is, after all, "Glitch Decoded"), swappable
// for the real vector logo file with no structural changes once supplied.
export default function IntroOverlay() {
  const hasEntered = useGalleryStore((s) => s.hasEntered)
  const setHasEntered = useGalleryStore((s) => s.setHasEntered)

  if (hasEntered) return null

  const enter = () => {
    // Must be called synchronously from this click handler — browsers
    // reject/suspend AudioContext creation outside a user gesture.
    startAmbient()
    setHasEntered(true)
  }

  return (
    <div
      onClick={enter}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        color: '#eee',
        fontFamily: 'monospace',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        zIndex: 100,
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          fontSize: 34,
          fontWeight: 700,
          letterSpacing: 4,
          position: 'relative',
          color: '#fff',
          textShadow: '-2px 0 #ff2b6d, 2px 2px #00e5ff',
        }}
      >
        GLITCH DECODED
      </div>
      <div style={{ fontSize: 13, opacity: 0.6, textAlign: 'center', maxWidth: 380, lineHeight: 1.6 }}>
        A first-person walkthrough of the exhibition.
        <br />
        Click anywhere to enter — this also enables ambient audio.
      </div>
      <button
        type="button"
        style={{
          padding: '10px 24px',
          background: 'none',
          border: '1px solid #555',
          color: '#eee',
          fontFamily: 'inherit',
          fontSize: 13,
          cursor: 'pointer',
        }}
      >
        Enter →
      </button>
    </div>
  )
}
