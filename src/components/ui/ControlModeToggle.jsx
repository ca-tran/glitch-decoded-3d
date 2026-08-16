import { useGalleryStore } from '../../store/useGalleryStore.js'
import { isDesktopDevice } from '../../utils/device.js'

// Minimal Phase 2 control surface — real IntroOverlay/Wayfinding UI comes in
// Phase 6. FPS toggle only appears on desktop; mobile/touch stays in
// click-to-move (the guide's default even on desktop).
export default function ControlModeToggle() {
  const controlMode = useGalleryStore((s) => s.controlMode)
  const setControlMode = useGalleryStore((s) => s.setControlMode)
  const desktop = isDesktopDevice()

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
      {desktop && (
        <button
          type="button"
          onClick={() => setControlMode(controlMode === 'fps' ? 'pointnav' : 'fps')}
          style={{
            pointerEvents: 'auto',
            padding: '8px 14px',
            background: 'rgba(0,0,0,0.7)',
            border: '1px solid #444',
            color: '#eee',
            fontFamily: 'inherit',
            fontSize: 13,
            cursor: 'pointer',
          }}
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
