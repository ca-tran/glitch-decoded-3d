// Heuristic used to gate FPS mode (PointerLockControls) to desktop, per the
// build guide — point-and-click navigation is the primary experience for
// mobile and non-gamer visitors.
export function isDesktopDevice() {
  if (typeof window === 'undefined') return false
  const hasFinePointer = window.matchMedia?.('(pointer: fine)').matches ?? true
  const hasNoTouch = !('ontouchstart' in window)
  return Boolean(hasFinePointer && hasNoTouch)
}
