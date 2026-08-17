// Outer Suspense fallback for the lazy-loaded GalleryScene *code chunk*
// (App.jsx) — deliberately has zero dependency on three/r3f/drei, so it can
// paint before that (genuinely large) bundle even starts downloading. The
// real per-asset progress screen (LoadingScreen.jsx, which needs drei's
// useProgress and therefore three) lives one layer in, inside GalleryScene
// itself, where it's no longer on this critical path.
export default function BootScreen() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0000aa',
        color: '#fff',
        fontFamily: 'monospace',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13,
        zIndex: 200,
      }}
    >
      LOADING…
    </div>
  )
}
