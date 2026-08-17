import { useProgress } from '@react-three/drei'

// Suspense fallback while the initial bundle and first-gallery assets load
// (Section 6). Styled toward the "Blue Screen of Death" visual identity
// referenced throughout the build guide. `useProgress` tracks THREE's
// global loading manager directly, so this is real load progress, not a
// faked animation.
export default function LoadingScreen() {
  const { progress } = useProgress()

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0000aa',
        color: '#fff',
        fontFamily: 'monospace',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        zIndex: 200,
      }}
    >
      <div style={{ fontSize: 22, letterSpacing: 2 }}>GLITCH DECODED</div>
      <div style={{ fontSize: 13, opacity: 0.85 }}>LOADING… {Math.round(progress)}%</div>
      <div style={{ width: 240, height: 4, background: 'rgba(255,255,255,0.25)' }}>
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: '#fff',
            transition: 'width 120ms linear',
          }}
        />
      </div>
    </div>
  )
}
