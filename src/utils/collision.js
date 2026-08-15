// Simple circle-vs-segment collision resolution for player movement in the
// XZ plane. Given a desired next position, pushes it back out of any wall
// segment it would penetrate. Walls are treated as solid at any height
// within this band — doorway cutouts are just absent from the segment list
// (see roomGeometry.js), so open doorways pass through untouched.
export function resolveCollision(nextX, nextZ, segments, radius = 0.35) {
  let x = nextX
  let z = nextZ

  for (const { x1, z1, x2, z2 } of segments) {
    const dx = x2 - x1
    const dz = z2 - z1
    const lenSq = dx * dx + dz * dz
    if (lenSq < 1e-6) continue

    let t = ((x - x1) * dx + (z - z1) * dz) / lenSq
    t = Math.max(0, Math.min(1, t))
    const closestX = x1 + t * dx
    const closestZ = z1 + t * dz

    const distX = x - closestX
    const distZ = z - closestZ
    const dist = Math.hypot(distX, distZ)

    if (dist < radius && dist > 1e-6) {
      const push = radius - dist
      x += (distX / dist) * push
      z += (distZ / dist) * push
    }
  }

  return [x, z]
}
