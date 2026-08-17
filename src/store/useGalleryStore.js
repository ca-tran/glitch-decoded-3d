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

  // Audio starts unmuted the moment the visitor enters (see IntroOverlay) —
  // this just tracks the mute toggle from then on.
  audioOn: true,
  setAudioOn: (on) => set({ audioOn: on }),

  // Gates the scene behind a "click to enter" interaction — required
  // anyway since AudioContext can only start on a real user gesture
  // (Phase 5). A full branded title card is Phase 6; this is the minimal
  // functional version that unblocks audio now.
  hasEntered: false,
  setHasEntered: (entered) => set({ hasEntered: entered }),

  focusedArtworkId: null,
  setFocusedArtworkId: (id) => set({ focusedArtworkId: id }),

  // Live camera transform, throttled from inside the Canvas (see
  // PlayerTracker.jsx) — read by Minimap.jsx, which lives outside the R3F
  // tree and has no other way to see the camera.
  playerPosition: [0, 1.6, 0],
  playerHeading: 0, // camera.rotation.y, radians
  setPlayerTransform: (position, heading) => set({ playerPosition: position, playerHeading: heading }),
}))
