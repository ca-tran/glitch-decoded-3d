import { useGalleryStore } from '../../store/useGalleryStore.js'
import { isDesktopDevice } from '../../utils/device.js'

// Minimal Phase 2/5 control surface — real Wayfinding UI comes in Phase 6.
// FPS toggle only appears on desktop; mobile/touch stays in click-to-move
// (the guide's default even on desktop). Audio toggle only appears once
// the visitor has entered (see IntroOverlay) — nothing to mute before that.
export default function ControlModeToggle() {
  const controlMode = useGalleryStore((s) => s.controlMode)
  const setControlMode = useGalleryStore((s) => s.setControlMode)
  const audioOn = useGalleryStore((s) => s.audioOn)
  const setAudioOn = useGalleryStore((s) => s.setAudioOn)
  const hasEntered = useGalleryStore((s) => s.hasEntered)
  const desktop = isDesktopDevice()

  const buttonStyle = {
    pointerEvents: 'auto',
    padding: '8px 14px',
    background: 'rgba(0,0,0,0.7)',
    border: '1px solid #444',
    color: '#eee',
    fontFamily: 'inherit',
    fontSize: 13,
    cursor: 'pointer',
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 12,
        right: 12,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        alignItems: 'flex-end',
        fontFamily: 'inherit',
        color: '#eee',
        pointerEvents: 'none',
      }}
    >
      {hasEntered && (
        <button type="button" onClick={() => setAudioOn(!audioOn)} style={buttonStyle}>
          {audioOn ? '♪ Audio on' : '♪ Audio off'}
        </button>
      )}
      {desktop && (
        <button
          type="button"
          onClick={() => setControlMode(controlMode === 'fps' ? 'pointnav' : 'fps')}
          style={buttonStyle}
        >
          {controlMode === 'fps' ? 'Switch to Walk (click-to-move)' : 'Switch to FPS (WASD + mouse)'}
        </button>
      )}
      <div
        style={{
          fontSize: 12,
          background: 'rgba(0,0,0,0.6)',
          padding: '6px 10px',
          maxWidth: 240,
          textAlign: 'right',
        }}
      >
        {controlMode === 'fps'
          ? 'Click the canvas to look around · WASD to move · Esc to release the cursor'
          : 'Click or tap the floor to walk there'}
      </div>
    </div>
  )
}
