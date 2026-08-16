// Shared wall-segment math used by both GalleryShell (rendering) and the
// player-movement collision system, so doorway cutouts stay in sync between
// what you see and what blocks you.

// Tessellates a shape's boundary into edges — one per straight run, several
// small ones per curve (e.g. Gallery 3's rounded corner). Shape-space
// (x, y) maps to world (x, -y); see GalleryShell for the full derivation.
export function computeBoundaryEdges(shape, segments = 24) {
  const points = shape.getPoints(segments)
  const edges = []
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]
    const b = points[i + 1]
    const dx = b.x - a.x
    const dy = b.y - a.y
    const length = Math.hypot(dx, dy)
    if (length < 1e-4) continue
    edges.push({
      index: i,
      length,
      midX: (a.x + b.x) / 2,
      midZ: -(a.y + b.y) / 2,
      angle: Math.atan2(dy, dx),
    })
  }
  return edges
}

// World-space unit vector a wall edge runs along.
function edgeDirection(angle) {
  return [Math.cos(angle), -Math.sin(angle)]
}

/**
 * Splits one boundary edge into renderable wall pieces (jambs + a lintel
 * above the opening, when a door cuts through it) and 2D collision segments
 * (jambs only — the door gap is simply absent from the list, and the lintel
 * is purely visual, above head height).
 *
 * `door` is optional: { width?: number, height?: number }, centered on the
 * edge. Returns the full edge unchanged when omitted.
 */
export function buildWallPieces(edge, height, door) {
  const [dx, dz] = edgeDirection(edge.angle)
  const halfLen = edge.length / 2
  const startX = edge.midX - dx * halfLen
  const startZ = edge.midZ - dz * halfLen
  const endX = edge.midX + dx * halfLen
  const endZ = edge.midZ + dz * halfLen

  if (!door) {
    return {
      render: [{ midX: edge.midX, midZ: edge.midZ, angle: edge.angle, length: edge.length, y0: 0, y1: height }],
      collision: [{ x1: startX, z1: startZ, x2: endX, z2: endZ }],
    }
  }

  const doorWidth = Math.min(door.width ?? 1.2, Math.max(edge.length - 0.2, 0.4))
  const doorHeight = door.height ?? 2.3
  const jamb = Math.max(0, (edge.length - doorWidth) / 2)

  const render = []
  const collision = []

  if (jamb > 0.02) {
    const leftEndX = startX + dx * jamb
    const leftEndZ = startZ + dz * jamb
    render.push({
      midX: startX + dx * (jamb / 2),
      midZ: startZ + dz * (jamb / 2),
      angle: edge.angle,
      length: jamb,
      y0: 0,
      y1: height,
    })
    collision.push({ x1: startX, z1: startZ, x2: leftEndX, z2: leftEndZ })

    const rightStartX = endX - dx * jamb
    const rightStartZ = endZ - dz * jamb
    render.push({
      midX: rightStartX + dx * (jamb / 2),
      midZ: rightStartZ + dz * (jamb / 2),
      angle: edge.angle,
      length: jamb,
      y0: 0,
      y1: height,
    })
    collision.push({ x1: rightStartX, z1: rightStartZ, x2: endX, z2: endZ })
  }

  render.push({
    midX: edge.midX,
    midZ: edge.midZ,
    angle: edge.angle,
    length: doorWidth,
    y0: doorHeight,
    y1: height,
  })

  return { render, collision }
}
