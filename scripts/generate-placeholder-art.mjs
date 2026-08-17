#!/usr/bin/env node
// Section 9 of the build guide: procedurally generated placeholder art so
// the scene reads correctly in scale/composition before real images exist.
// Generates one file per artwork in data/artworks.js, at that work's real
// aspect ratio, with title + artist on a neutral grey field. Video works get
// a small "▶ video" badge instead of real footage.
//
// Implemented as SVG rather than a rasterized JPG (avoids a native `canvas`
// build dependency) — browsers/Three.js load SVGs as textures identically
// to any other image format, so this is a drop-in per the guide's intent.
// Run again whenever `dimensions` or titles change in artworks.js.

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { artworks } from '../src/data/artworks.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '../public/assets/artworks')
const PIXELS_PER_METRE = 220 // controls output resolution, not room scale
// Section 6: "cap artwork textures at 1600px on the long edge — full-res
// files aren't needed at typical viewing distance and will bloat load
// time." Current placeholders are well under this at 220px/m, but this
// keeps the policy enforced if a future artwork's real dimensions are
// large enough to exceed it (a big wall-scale work, say).
const MAX_LONG_EDGE = 1600

function escapeXml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
  }[c]))
}

function buildSvg(artwork) {
  const { width, height } = artwork.dimensions
  let w = Math.max(1, Math.round(width * PIXELS_PER_METRE))
  let h = Math.max(1, Math.round(height * PIXELS_PER_METRE))
  const longEdge = Math.max(w, h)
  if (longEdge > MAX_LONG_EDGE) {
    const scale = MAX_LONG_EDGE / longEdge
    w = Math.round(w * scale)
    h = Math.round(h * scale)
  }
  const isVideo = artwork.mediaType === 'video'

  const title = escapeXml(artwork.title)
  const artist = escapeXml(artwork.artist)
  const fontSize = Math.max(12, Math.round(Math.min(w, h) * 0.07))
  const smallFontSize = Math.max(10, Math.round(fontSize * 0.7))

  const badge = isVideo
    ? `<g>
        <rect x="${w - 90}" y="12" width="78" height="28" rx="4" fill="rgba(0,0,0,0.55)" />
        <text x="${w - 51}" y="31" text-anchor="middle" font-family="monospace" font-size="14" fill="#eee">&#9654; video</text>
      </g>`
    : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="#8a8a8a" />
  <rect x="6" y="6" width="${w - 12}" height="${h - 12}" fill="none" stroke="#5f5f5f" stroke-width="2" />
  <text x="${w / 2}" y="${h / 2 - fontSize * 0.2}" text-anchor="middle" font-family="monospace" font-size="${fontSize}" fill="#1a1a1a">${title}</text>
  <text x="${w / 2}" y="${h / 2 + fontSize * 0.9}" text-anchor="middle" font-family="monospace" font-size="${smallFontSize}" fill="#333">${artist}</text>
  ${badge}
</svg>`
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  for (const artwork of artworks) {
    const svg = buildSvg(artwork)
    const filePath = join(OUT_DIR, `${artwork.id}.svg`)
    await writeFile(filePath, svg, 'utf8')
    console.log('wrote', filePath)
  }
  console.log(`Generated ${artworks.length} placeholder(s) into ${OUT_DIR}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
