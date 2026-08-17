import { galleries } from '../data/artworks.js'

// Row layout, placeholder pending real floorplan adjacency. Each room's z is
// offset by half its own depth so every room's centered doorway lands on a
// shared z=0 "spine" — see the door-edge comments in each Gallery*.jsx and
// roomGeometry.js for how doorway cutouts are computed. Shared between
// App.jsx (world placement) and Minimap.jsx (needs the same positions to
// draw room outlines that actually line up with the real geometry).
export const GAP = 4
export const ROOM_ORDER = ['courtyard', 'gallery1', 'gallery2', 'gallery3', 'gallery4']

export const ROOM_LABELS = {
  courtyard: 'Courtyard',
  gallery1: 'Gallery 1',
  gallery2: 'Gallery 2',
  gallery3: 'Gallery 3',
  gallery4: 'Gallery 4',
}

export function computeRoomLayout() {
  let x = 0
  const positions = {}
  for (const key of ROOM_ORDER) {
    const { width, depth } = galleries[key]
    positions[key] = [x, 0, depth / 2]
    x += width + GAP
  }
  return positions
}
