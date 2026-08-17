// Static heuristic used to drop shadow maps (and, later, any postprocessing)
// on low-end devices rather than showing a stuttering scene (Section 6).
// The guide offers two options — this or a live FPS probe over the first
// few frames; a static check is simpler and has no false-negative window
// where the scene stutters before the probe finishes deciding.
export function isLowPowerDevice() {
  if (typeof navigator === 'undefined') return false
  const cores = navigator.hardwareConcurrency ?? 4
  return cores <= 4
}
