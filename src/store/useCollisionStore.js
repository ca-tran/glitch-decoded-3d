import { create } from 'zustand'

// Registry of 2D (world XZ) wall segments used for player-vs-wall collision.
// Each GalleryShell registers its own segments on mount and removes them on
// unmount, so the collidable set always matches what's actually rendered —
// including doorway cutouts — and stays correct once Section 6's "unmount
// off-screen galleries" optimization lands.
export const useCollisionStore = create((set, get) => ({
  segmentsByRoom: {},
  registerSegments: (roomId, segments) =>
    set((state) => ({ segmentsByRoom: { ...state.segmentsByRoom, [roomId]: segments } })),
  unregisterSegments: (roomId) =>
    set((state) => {
      const next = { ...state.segmentsByRoom }
      delete next[roomId]
      return { segmentsByRoom: next }
    }),
  getAllSegments: () => Object.values(get().segmentsByRoom).flat(),
}))
