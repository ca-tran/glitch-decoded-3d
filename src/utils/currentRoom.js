import { galleries } from '../data/artworks.js'
import { computeRoomLayout, ROOM_ORDER } from './roomLayout.js'

// "Unmount off-screen galleries entirely" (Section 6) — the biggest single
// perf win the guide calls out, bigger than any per-object optimization.
// Rooms sit in a simple linear chain (courtyard–gallery1–…–gallery4), so
// "which room is the player near" reduces to a 1D nearest-range check
// against each room's world-x span — no need for real point-in-polygon
// tests here, this only has to be a reasonable culling decision, not a
// precise one.
//
// Keeps the current room's immediate neighbors visible too (not just the
// exact room), so nothing pops in/out right as you cross a doorway — you
// only ever stand in the "current" room or the doorway between it and a
// neighbor, both of which stay mounted throughout that transition.
export function resolveVisibleRooms(playerX) {
  const layout = computeRoomLayout()

  let currentIndex = 0
  let bestDist = Infinity
  ROOM_ORDER.forEach((key, i) => {
    const [roomX] = layout[key]
    const { width } = galleries[key]
    const dist = playerX < roomX ? roomX - playerX : playerX > roomX + width ? playerX - (roomX + width) : 0
    if (dist < bestDist) {
      bestDist = dist
      currentIndex = i
    }
  })

  const visible = new Set([ROOM_ORDER[currentIndex]])
  if (ROOM_ORDER[currentIndex - 1]) visible.add(ROOM_ORDER[currentIndex - 1])
  if (ROOM_ORDER[currentIndex + 1]) visible.add(ROOM_ORDER[currentIndex + 1])

  return { current: ROOM_ORDER[currentIndex], visible }
}
