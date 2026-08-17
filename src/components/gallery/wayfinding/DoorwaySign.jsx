import { useMemo } from 'react'
import * as THREE from 'three'
import { computeBoundaryEdges } from '../roomGeometry.js'

// In-3D signage at a doorway — text-based placeholder pending the real
// pixel-icon set from the Wayfindings page (Section 9); swapping in real
// icon textures later only touches this file. Positioned above the door
// lintel, facing into the room (same edge-angle convention as artwork
// placement and wall-wash lights, so it always sits flush with the wall).
//
// Renders the label onto a canvas texture rather than using drei's <Text>
// (troika-three-text) — troika fetches its default font from a remote CDN
// on first use, which fails outright on restrictive networks (and did in
// this environment). A canvas texture has zero network dependency.
function buildLabelTexture(label) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 160
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#111111'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = '#444444'
  ctx.lineWidth = 4
  ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4)
  ctx.fillStyle = '#ffffff'
  ctx.font = '600 64px monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, canvas.width / 2, canvas.height / 2)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export default function DoorwaySign({ shape, edgeIndex, label, height = 2.5, segments = 24 }) {
  const { position, rotationY } = useMemo(() => {
    const edges = computeBoundaryEdges(shape, segments)
    const edge = edges.find((e) => e.index === edgeIndex)
    const rotY = edge.angle + Math.PI
    const nx = Math.sin(rotY)
    const nz = Math.cos(rotY)
    // Nudge off the wall face, same as artwork/wash-light placement.
    return { position: [edge.midX + nx * 0.05, height, edge.midZ + nz * 0.05], rotationY: rotY }
  }, [shape, edgeIndex, height, segments])

  const texture = useMemo(() => buildLabelTexture(label), [label])

  return (
    <mesh position={position} rotation={[0, rotationY, 0]}>
      <planeGeometry args={[1.0, 0.3125]} />
      <meshStandardMaterial map={texture} roughness={0.95} metalness={0} />
    </mesh>
  )
}
