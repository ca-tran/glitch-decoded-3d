import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { computeBoundaryEdges, buildWallPieces } from './roomGeometry.js'
import { useCollisionStore } from '../../store/useCollisionStore.js'

/**
 * Generic room shell: takes a 2D floor-plan footprint (a THREE.Shape, in the
 * shape's local XY plane, mapped to world XZ) and builds a flat floor, flat
 * ceiling, and wall geometry — so non-rectangular floorplans (triangular /
 * L-shaped galleries) read correctly instead of being forced into box
 * geometry.
 *
 * Shape-space (x, y) maps to world (x, -y) so shapes can be authored with
 * "normal" screen-style coordinates (y increasing "down/into" the room).
 *
 * `doors` cuts a doorway (jambs + lintel) into specific boundary edges —
 * `{ [edgeIndex]: { width?, height? } }` — and registers the resulting
 * collision segments into the shared collision store (keyed by `roomId`) so
 * player movement is blocked by walls but passes through doorway gaps.
 *
 * Wall pieces are merged into one mesh per distinct color (Section 6: "merge
 * static room geometry ... into as few meshes as possible per gallery rather
 * than one mesh per wall segment"). Gallery 3's rounded corner alone used to
 * tessellate into ~26 separate wall meshes; grouped by color it's 2 (the
 * white intro wall + everything else). Each piece's transform is baked
 * directly into its geometry before merging, since a merged mesh only has
 * one overall transform to work with.
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

  const { wallGroups, collisionSegments } = useMemo(() => {
    const piecesByColor = new Map()
    const collision = []

    for (const edge of edges) {
      const pieces = buildWallPieces(edge, height, doors[edge.index])
      const color = wallColorOverrides[edge.index] ?? wallColor
      for (const piece of pieces.render) {
        const geo = new THREE.PlaneGeometry(piece.length, piece.y1 - piece.y0)
        // Bake this piece's transform into its vertices — rotate first, then
        // translate, matching how a mesh with the same position/rotation
        // props would render (rotation applied in local space, then offset).
        geo.rotateY(piece.angle)
        geo.translate(piece.midX, (piece.y0 + piece.y1) / 2, piece.midZ)
        if (!piecesByColor.has(color)) piecesByColor.set(color, [])
        piecesByColor.get(color).push(geo)
      }
      for (const seg of pieces.collision) collision.push(seg)
    }

    const groups = [...piecesByColor.entries()].map(([color, geos]) => ({
      color,
      geometry: mergeGeometries(geos, false),
    }))

    return { wallGroups: groups, collisionSegments: collision }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edges, height, JSON.stringify(doors), JSON.stringify(wallColorOverrides), wallColor])

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

      {wallGroups.map((group, i) => (
        <mesh key={i} geometry={group.geometry} receiveShadow>
          <meshStandardMaterial color={group.color} roughness={0.9} metalness={0} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}
