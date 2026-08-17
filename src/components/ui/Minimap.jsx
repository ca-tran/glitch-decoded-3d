import { useMemo } from 'react'
import { useGalleryStore } from '../../store/useGalleryStore.js'
import { galleries } from '../../data/artworks.js'
import { computeRoomLayout, ROOM_ORDER, ROOM_LABELS } from '../../utils/roomLayout.js'
import { rectanglePlan, rightTrianglePlan, roundedRightTrianglePlan, lShapePlan } from '../gallery/floorplans.js'

// Top-down wayfinding overlay — real room footprints (not just bounding
// boxes), reusing the exact same shape builders the 3D rooms are built
// from, so the minimap actually matches the geometry you're standing in.
// Placeholder pixel-icon styling pending the real Wayfindings page assets
// (Section 9) — this is plain SVG for now.

const SHAPE_BUILDERS = {
  courtyard: rectanglePlan,
  gallery1: rectanglePlan,
  gallery2: rightTrianglePlan,
  gallery3: roundedRightTrianglePlan,
  gallery4: lShapePlan,
}

const SVG_WIDTH = 300
const PADDING = 10

// Shape-space (x, y) -> world (x, -y), same convention as roomGeometry.js.
function shapeToWorldPoints(shape, position) {
  const pts = shape.getPoints(24)
  const [px, , pz] = position
  return pts.map((p) => [px + p.x, pz - p.y])
}

function useRoomOutlines() {
  return useMemo(() => {
    const layout = computeRoomLayout()
    const outlines = {}
    let minX = Infinity
    let maxX = -Infinity
    let minZ = Infinity
    let maxZ = -Infinity

    for (const key of ROOM_ORDER) {
      const { width, depth } = galleries[key]
      const shape = SHAPE_BUILDERS[key](width, depth)
      const points = shapeToWorldPoints(shape, layout[key])
      outlines[key] = points
      for (const [x, z] of points) {
        minX = Math.min(minX, x)
        maxX = Math.max(maxX, x)
        minZ = Math.min(minZ, z)
        maxZ = Math.max(maxZ, z)
      }
    }

    const worldWidth = maxX - minX
    const worldDepth = maxZ - minZ
    const scale = (SVG_WIDTH - PADDING * 2) / worldWidth
    const svgHeight = worldDepth * scale + PADDING * 2

    const project = (x, z) => [(x - minX) * scale + PADDING, (z - minZ) * scale + PADDING]

    return { outlines, layout, project, svgHeight }
  }, [])
}

export default function Minimap() {
  const hasEntered = useGalleryStore((s) => s.hasEntered)
  const playerPosition = useGalleryStore((s) => s.playerPosition)
  const playerHeading = useGalleryStore((s) => s.playerHeading)
  const { outlines, project, svgHeight } = useRoomOutlines()

  if (!hasEntered) return null

  const [px, py] = project(playerPosition[0], playerPosition[2])
  // Camera forward is (-sin(heading), 0, -cos(heading)); the minimap maps
  // world (x, z) -> svg (x, y) with no axis flip, so the on-screen rotation
  // that points a "north-up" marker along that forward vector works out to
  // simply -heading (verified against the FPS convention: heading=-PI/2
  // faces world +X, which should point right on the map — rotate(90) does).
  const headingDeg = -playerHeading * (180 / Math.PI)

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 12,
        left: 12,
        zIndex: 10,
        background: 'rgba(0,0,0,0.65)',
        border: '1px solid #333',
        padding: 6,
      }}
    >
      <svg width={SVG_WIDTH} height={svgHeight} style={{ display: 'block' }}>
        {ROOM_ORDER.map((key) => (
          <polygon
            key={key}
            points={outlines[key].map(([x, z]) => project(x, z).join(',')).join(' ')}
            fill={key === 'courtyard' ? '#222' : '#3a3a3a'}
            stroke="#888"
            strokeWidth={1}
          />
        ))}
        {ROOM_ORDER.map((key) => {
          const [cx, cz] = outlines[key].reduce(
            ([sx, sz], [x, z]) => [sx + x / outlines[key].length, sz + z / outlines[key].length],
            [0, 0],
          )
          const [lx, ly] = project(cx, cz)
          return (
            <text
              key={key}
              x={lx}
              y={ly}
              fontSize={8}
              fontFamily="monospace"
              fill="#aaa"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {ROOM_LABELS[key].replace('Gallery ', 'G')}
            </text>
          )
        })}
        <g transform={`translate(${px},${py}) rotate(${headingDeg})`}>
          <path d="M 0,-6 L 4,5 L -4,5 Z" fill="#4ade80" />
        </g>
      </svg>
    </div>
  )
}
