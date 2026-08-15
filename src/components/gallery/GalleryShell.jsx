import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Generic room shell: takes a 2D floor-plan footprint (a THREE.Shape, in the
 * shape's local XY plane, mapped to world XZ) and builds a flat floor,
 * flat ceiling, and one wall quad per boundary edge — so non-rectangular
 * floorplans (triangular / L-shaped galleries) read correctly instead of
 * being forced into box geometry.
 *
 * Shape-space (x, y) maps to world (x, -y) so shapes can be authored with
 * "normal" screen-style coordinates (y increasing "down/into" the room).
 */
export default function GalleryShell({
  shape,
  height,
  floorColor = '#141414',
  ceilingColor = '#0a0a0a',
  wallColor = '#111111',
  wallColorOverrides = {}, // { [edgeIndex]: color } — e.g. a single painted "intro" wall
  ceiling = true,
  segments = 24,
  position = [0, 0, 0],
}) {
  const points = useMemo(() => shape.getPoints(segments), [shape, segments])

  const floorGeometry = useMemo(() => {
    const geo = new THREE.ShapeGeometry(shape)
    geo.rotateX(-Math.PI / 2)
    return geo
  }, [shape])

  const walls = useMemo(() => {
    const segs = []
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i]
      const b = points[i + 1]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const length = Math.hypot(dx, dy)
      if (length < 1e-4) continue
      segs.push({
        index: i,
        length,
        midX: (a.x + b.x) / 2,
        midZ: -(a.y + b.y) / 2,
        angle: Math.atan2(dy, dx),
      })
    }
    return segs
  }, [points])

  return (
    <group position={position}>
      <mesh geometry={floorGeometry} receiveShadow>
        <meshStandardMaterial color={floorColor} roughness={0.95} metalness={0} />
      </mesh>

      {ceiling && (
        <mesh
          geometry={floorGeometry}
          position={[0, height, 0]}
          rotation={[0, 0, Math.PI]}
          receiveShadow
        >
          <meshStandardMaterial color={ceilingColor} roughness={0.95} metalness={0} />
        </mesh>
      )}

      {walls.map((w) => (
        <mesh key={w.index} position={[w.midX, height / 2, w.midZ]} rotation={[0, w.angle, 0]} receiveShadow>
          <planeGeometry args={[w.length, height]} />
          <meshStandardMaterial
            color={wallColorOverrides[w.index] ?? wallColor}
            roughness={0.9}
            metalness={0}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}
