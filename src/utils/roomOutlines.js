// Pure-JS polygon outlines mirroring gallery/floorplans.js's shape builders
// — used only by Minimap.jsx, which is loaded eagerly (outside the lazy
// GalleryScene chunk) and must not pull in `three` just to draw an SVG
// outline. floorplans.js builds real THREE.Shape geometry for the 3D rooms
// and stays THREE-dependent; these are deliberately simple/stable
// footprints, kept in sync by hand if either changes.

export function rectangleOutline(width, depth) {
  return [
    [0, 0],
    [width, 0],
    [width, depth],
    [0, depth],
    [0, 0],
  ]
}

export function rightTriangleOutline(width, depth) {
  return [
    [0, 0],
    [width, 0],
    [0, depth],
    [0, 0],
  ]
}

// Mirrors floorplans.js's quadraticCurveTo(0, 0, radius, 0) from (0,radius)
// via control point (0,0) to (radius,0): B(t) = (1-t)^2*P0 + 2(1-t)t*P1 + t^2*P2.
export function roundedRightTriangleOutline(width, depth, radius = 0.4, segments = 12) {
  const points = [
    [radius, 0],
    [width, 0],
    [0, depth],
    [0, radius],
  ]
  for (let i = 1; i <= segments; i++) {
    const t = i / segments
    points.push([t * t * radius, (1 - t) * (1 - t) * radius])
  }
  return points
}

export function lShapeOutline(width, depth, notchWidth = width / 3, notchDepth = depth / 2) {
  return [
    [0, 0],
    [width, 0],
    [width, depth - notchDepth],
    [width - notchWidth, depth - notchDepth],
    [width - notchWidth, depth],
    [0, depth],
    [0, 0],
  ]
}
