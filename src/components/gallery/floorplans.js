import * as THREE from 'three'

// Floor-plan builders — one THREE.Shape per gallery footprint, built with
// lineTo/quadraticCurveTo per the build guide's instruction to use
// THREE.Shape + extrusion rather than forcing box geometry on the
// triangular/L-shaped rooms. Each shape is authored with its origin at one
// corner; GalleryShell centers nothing, so world placement is handled via
// the `position` prop on each <GalleryShell>.

export function rectanglePlan(width, depth) {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.lineTo(width, 0)
  shape.lineTo(width, depth)
  shape.lineTo(0, depth)
  shape.closePath()
  return shape
}

// Right-angle corner at the origin, legs along +x (width) and +y (depth).
export function rightTrianglePlan(width, depth) {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.lineTo(width, 0)
  shape.lineTo(0, depth)
  shape.closePath()
  return shape
}

// Same right-triangle footprint but with the right-angle corner rounded off
// (per the Gallery 3 floorplan notes) — approximated with a quadratic
// corner radius since the exact fillet isn't in the source drawings yet.
export function roundedRightTrianglePlan(width, depth, radius = 0.4) {
  const shape = new THREE.Shape()
  shape.moveTo(radius, 0)
  shape.lineTo(width, 0)
  shape.lineTo(0, depth)
  shape.lineTo(0, radius)
  shape.quadraticCurveTo(0, 0, radius, 0)
  shape.closePath()
  return shape
}

// L-shape: outer footprint width x depth with a rectangular notch removed
// from the far corner. Notch proportions are a placeholder (roughly a third
// of each dimension) pending the exact floorplan cut.
export function lShapePlan(width, depth, notchWidth = width / 3, notchDepth = depth / 2) {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.lineTo(width, 0)
  shape.lineTo(width, depth - notchDepth)
  shape.lineTo(width - notchWidth, depth - notchDepth)
  shape.lineTo(width - notchWidth, depth)
  shape.lineTo(0, depth)
  shape.closePath()
  return shape
}
