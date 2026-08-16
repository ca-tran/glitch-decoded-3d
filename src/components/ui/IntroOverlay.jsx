import { useGalleryStore } from '../../store/useGalleryStore.js'
import { startAmbient } from '../../audio/audioEngine.js'

// Minimal "click to enter" gate — necessary functional infrastructure for
// Phase 5's audio (AudioContext can only start inside a real user gesture,
// not a React effect), not the full branded title card. That's Phase 6
// (logo, wayfinding, styled to the Blue Screen of Death visual identity
// per the build guide) — this component's job is just to unblock audio
// and get out of the way.
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
        gap: 24,
        zIndex: 100,
        cursor: 'pointer',
      }}
    >
      <div style={{ fontSize: 28, letterSpacing: 3 }}>GLITCH DECODED</div>
      <div style={{ fontSize: 13, opacity: 0.6, textAlign: 'center', maxWidth: 360, lineHeight: 1.6 }}>
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
