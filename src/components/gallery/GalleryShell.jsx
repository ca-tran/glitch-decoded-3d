import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { computeBoundaryEdges, buildWallPieces } from './roomGeometry.js'
import { useCollisionStore } from '../../store/useCollisionStore.js'

/**
 * Generic room shell: takes a 2D floor-plan footprint (a THREE.Shape, in the
 * shape's local XY plane, mapped to world XZ) and builds a flat floor,
 * flat ceiling, and one wall quad per boundary edge — so non-rectangular
 * floorplans (triangular / L-shaped galleries) read correctly instead of
 * being forced into box geometry.
 *
 * Shape-space (x, y) maps to world (x, -y) so shapes can be authored with
 * "normal" screen-style coordinates (y increasing "down/into" the room).
 *
 * `doors` cuts a doorway (jambs + lintel) into specific boundary edges —
 * `{ [edgeIndex]: { width?, height? } }` — and registers the resulting
 * collision segments into the shared collision store (keyed by `roomId`) so
 * player movement is blocked by walls but passes through doorway gaps.
 */
export default function GalleryShell({
  shape,
  height,
  floorColor = '#141414',
  ceilingColor = '#0a0a0a',
  wallColor = '#111111',
  wallColorOverrides = {}, // { [edgeIndex]: color } — e.g. a single painted "intro" wall
  doors = {}, // { [edgeIndex]: { width, height } }
  ceiling = true,
  segments = 24,
  position = [0, 0, 0],
  roomId,
}) {
  const edges = useMemo(() => computeBoundaryEdges(shape, segments), [shape, segments])

  const floorGeometry = useMemo(() => {
    const geo = new THREE.ShapeGeometry(shape)
    geo.rotateX(-Math.PI / 2)
    return geo
  }, [shape])

  const { renderPieces, collisionSegments } = useMemo(() => {
    const render = []
    const collision = []
    for (const edge of edges) {
      const pieces = buildWallPieces(edge, height, doors[edge.index])
      for (const piece of pieces.render) render.push({ ...piece, edgeIndex: edge.index })
      for (const seg of pieces.collision) collision.push(seg)
    }
    return { renderPieces: render, collisionSegments: collision }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edges, height, JSON.stringify(doors)])

  const registerSegments = useCollisionStore((s) => s.registerSegments)
  const unregisterSegments = useCollisionStore((s) => s.unregisterSegments)

  useEffect(() => {
    if (!roomId) return
    const [px, , pz] = position
    const worldSegments = collisionSegments.map((s) => ({
      x1: s.x1 + px,
      z1: s.z1 + pz,
      x2: s.x2 + px,
      z2: s.z2 + pz,
    }))
    registerSegments(roomId, worldSegments)
    return () => unregisterSegments(roomId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, collisionSegments, position[0], position[2]])

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

      {renderPieces.map((piece, i) => (
        <mesh
          key={i}
          position={[piece.midX, (piece.y0 + piece.y1) / 2, piece.midZ]}
          rotation={[0, piece.angle, 0]}
          receiveShadow
        >
          <planeGeometry args={[piece.length, piece.y1 - piece.y0]} />
          <meshStandardMaterial
            color={wallColorOverrides[piece.edgeIndex] ?? wallColor}
            roughness={0.9}
            metalness={0}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}
