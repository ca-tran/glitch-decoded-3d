import { create } from 'zustand'

// Lightweight global state — avoids prop-drilling through the R3F scene
// graph. Minimal for now (Phase 1: room shells); grows with Phase 2
// (control mode / current gallery for culling) and Phase 3+ (focused artwork,
// audio on/off).
export const useGalleryStore = create((set) => ({
  currentGallery: 'courtyard',
  setCurrentGallery: (gallery) => set({ currentGallery: gallery }),

  controlMode: 'orbit', // 'orbit' (dev/Phase 1) | 'fps' | 'pointnav' (Phase 2)
  setControlMode: (mode) => set({ controlMode: mode }),

  audioOn: false,
  setAudioOn: (on) => set({ audioOn: on }),

  focusedArtworkId: null,
  setFocusedArtworkId: (id) => set({ focusedArtworkId: id }),
}))
