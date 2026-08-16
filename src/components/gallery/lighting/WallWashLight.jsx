import { useMemo } from 'react'
import { computeBoundaryEdges } from '../roomGeometry.js'

/**
 * A soft rectangular wall-wash fixture for flat (non-sculptural) works, per
 * the build guide's Gallery 1/4 lighting note: "subtle wall wash on flat
 * works" (spotlights are reserved for sculptures — none are placed yet).
 *
 * Positioned a little into the room from the wall and aimed back at it,
 * reusing the exact same edge-angle math as artwork placement/doorways
 * (roomGeometry.js) so it always lines up with whichever wall it's given.
 */
export default function WallWashLight({
  shape,
  edgeIndex,
  segments = 24,
  height = 2.4, // mount height (near ceiling, but not flush with it)
  inset = 1.6, // distance into the room from the wall
  width = 3.2,
  lightHeight = 1.6,
  intensity = 6,
  color = '#ffffff',
}) {
  const { position, rotationY } = useMemo(() => {
    const edges = computeBoundaryEdges(shape, segments)
    const edge = edges.find((e) => e.index === edgeIndex)
    const rotY = edge.angle + Math.PI // same convention as artwork facing (see ArtworkPlane)
    const nx = Math.sin(rotY)
    const nz = Math.cos(rotY)
    return {
      position: [edge.midX + nx * inset, height, edge.midZ + nz * inset],
      rotationY: rotY,
    }
  }, [shape, edgeIndex, segments, height, inset])

  return (
    <rectAreaLight
      position={position}
      rotation={[0, rotationY, 0]}
      width={width}
      height={lightHeight}
      intensity={intensity}
      color={color}
    />
  )
}
