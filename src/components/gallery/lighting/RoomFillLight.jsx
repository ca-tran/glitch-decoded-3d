// A small bounded PointLight used as a room's local "ambient" fill.
// Deliberately NOT a THREE.AmbientLight — ambient lights have no falloff and
// would leak into neighbouring rooms (all 5 rooms render simultaneously
// until Section 6's "unmount off-screen galleries" optimization lands), so
// each gallery gets its own point light with a distance cutoff roughly
// matching its footprint instead.
//
// `intensity` is candela (physically-based decay=2 falloff, not the old
// 0–1 convention) — needs to be in the tens/hundreds to read as anything
// at typical room distances, not fractions.
export default function RoomFillLight({ position, intensity = 40, distance = 6, color = '#ffffff' }) {
  return <pointLight position={position} intensity={intensity} distance={distance} decay={2} color={color} />
}
