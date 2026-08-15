import { create } from 'zustand'

// Lightweight global state — avoids prop-drilling through the R3F scene
// graph. Minimal for now (Phase 1: room shells); grows with Phase 2
// (control mode / current gallery for culling) and Phase 3+ (focused artwork,
// audio on/off).
export const useGalleryStore = create((set) => ({
  currentGallery: 'courtyard',
  setCurrentGallery: (gallery) => set({ currentGallery: gallery }),

  // 'pointnav' is the default per the build guide — primary mode for mobile
  // and non-gamer visitors; 'fps' is an optional desktop toggle.
  controlMode: 'pointnav', // 'pointnav' | 'fps'
  setControlMode: (mode) => set({ controlMode: mode }),

  audioOn: false,
  setAudioOn: (on) => set({ audioOn: on }),

  focusedArtworkId: null,
  setFocusedArtworkId: (id) => set({ focusedArtworkId: id }),
}))
